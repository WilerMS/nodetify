import { Router } from 'express'

import { Alarm, Database, Severity } from '@/models'
import { withErrorHandling } from '@/utils'
import { BadRequestError, NotFoundError } from '@/errors'
import { authenticateToken, validateBody } from '@/middlewares'
import { type Column } from '@/services/db-service/utils/types'
import { type AlarmService } from '@/services/alarms-service'
import { validateAlarmConditionOperator, validateAlarmConditionValue } from '@/services/alarms-service/utils'

export const router = Router()
export const endpoint = '/alarms'

/*
  TODO: ENDPOINTS:
    * ✔️ GET / -> (Obtener todas las alarmas del usuario actual)
    * ✔️ GET /:alarm_id -> (Obtener una alarma del usuario actual)
    * ✖️ GET /:alarm_id/conditions -> (Obtener condiciones de una alarma del usuario actual)
    * ✖️ GET /:alarm_id/conditions/:condition_id -> (Obtener una condición de una alarma del usuario actual)
    * ✖️ POST / -> (Agregar una alarma con todas sus condiciones)
    * ✖️ POST /:alarm_id/conditions -> (Agregar una condición)
    * ✖️ PATCH /:alarm_id -> (Modificar una alarma del usuario, sin modificar condiciones)
    * ✖️ PATCH /:alarm_id/conditions/:condition_id -> (Modificar una condicion de una alarma concreta del usuario actual)
    * ✖️ DELETE /:alarm_id -> (Eliminar una alarma del usuario actual)
    * ✖️ DELETE /:alarm_id/conditions/:condition_id -> (Eliminar una condición del usuario actual)
*/

router.get(
  '/',
  authenticateToken,
  withErrorHandling(async (req: AuthRequest, res) => {
    const { user } = req.auth!
    const alarms = await Alarm
      .query()
      .where({ user_id: user.id })
      .withGraphFetched('[severity, database, condition, alerts]')
    return res.json(alarms)
  })
)

router.get(
  '/:id',
  authenticateToken,
  withErrorHandling(async (req: AuthRequest, res) => {
    const { id } = req.params
    const { user } = req.auth!
    const alarm = await Alarm
      .query()
      .findById(id)
      .where({ user_id: user.id })
      .withGraphFetched('[severity, database, conditions, alerts]')

    if (!alarm) throw new NotFoundError('Alarm not found')
    return res.json(alarm)
  })
)

// TODO: Que hago si el trigger falla? Registro y luego ya añado, o doy un error? (SIN DECIDIR)
router.post(
  '/',
  authenticateToken,
  validateBody(Alarm.bodySchema),
  withErrorHandling(async (req: AuthRequest, res) => {
    const { user } = req.auth!
    const body = { ...req.body, user_id: user.id } as unknown as Alarm

    // * Check if the selected database exists
    const database = await Database.query()
      .findById(body.database_id)
      .where({ user_id: user.id })

    if (!database) throw new BadRequestError('Selected database does not exist.')

    // * Check if tablename exists in the selected database schema
    const table = database.schema.find(table => body.table_name === table.name)
    if (!table || table.name !== body.table_name) {
      throw new BadRequestError('Selected table does not exist in the selected database')
    }

    // * Check if conditions can be applied to the selected table
    const columns: Record<string, Column> = table.columns.reduce(
      (acc, curr) => ({ ...acc, [curr.name]: curr }), {}
    )

    for (const condition of body.condition!) {
      const column = columns[condition.column_name]
      if (!column) {
        throw new BadRequestError(`One of the conditions is malformed. The column '${condition.column_name}' does not exist in database.`)
      }

      if (!validateAlarmConditionOperator(condition, column)) {
        throw new BadRequestError(`One of the conditions is malformed. Invalid operator '${condition.operator}' for the type '${column.type}' in the column '${condition.column_name}'`)
      }

      if (!validateAlarmConditionValue(condition, column)) {
        throw new BadRequestError(`One of the conditions is malformed. Invalid value '${condition.value}' for the type '${column.type}' in the column '${condition.column_name}'`)
      }
    }

    const newAlarm = await Alarm.query().insertGraph(body)

    // TODO: Quizas haga falta mover esto a otro sitio
    const alarmService = req.app.get('AlarmService') as unknown as AlarmService
    alarmService.addOrReplaceAlarm(newAlarm)

    return res.status(201).json(newAlarm)
  })
)

// TODO: Verificar la autenticación del usuario
// TODO: Validar el cuerpo de la petición (comprobar que sigue el schema de la bbdd)
// TODO: Verificar si las alarmas pertenencen al usuario que las quiere modificar
// TODO: Cambiar el trigger si se cambia la tabla a la que afecta
// TODO: En caso de cambiar la tabla, debería no permitirlo?? Elimino todas las condiciones??
// TODO: Se pueden modificar las condiciones??? O simplemente, borrar y hacer nuevas?
router.patch(
  '/:id',
  authenticateToken,
  validateBody(Alarm.bodySchema),
  withErrorHandling(async (req: AuthRequest, res) => {
    const { id } = req.params
    const { database_id, name, description, table_name, severity_id, enabled } = req.body

    const updated = await Alarm
      .query()
      .findById(id)
      .where({ user_id: req.auth?.user.id })
      .patch({
        database_id,
        name,
        description,
        table_name,
        severity_id,
        enabled
      })

    if (!updated) throw new NotFoundError('Alarm not found')

    const alarm = await Alarm.query().findById(id).withGraphFetched('[severity, database, conditions, alerts]')

    return res.json(alarm)
  })
)

// TODO: Verificar la autenticación del usuario
// TODO: Verificar si las alarmas pertenencen al usuario que las elimina
// TODO: Eliminar el trigger de la base de datos a la que pertenece
router.delete(
  '/:id',
  authenticateToken,
  withErrorHandling(async (req: AuthRequest, res) => {
    const { id } = req.params
    const deleted = await Alarm
      .query()
      .deleteById(id)
      .where({ user_id: req.auth?.user.id })

    if (!deleted) throw new NotFoundError('Alarm not found')

    return res.json({ message: 'Alarm deleted successfully' })
  })
)

// TODO: He decidido cambiarlo y hacerlo manualmente
router.get(
  '/schema',
  authenticateToken,
  withErrorHandling(async (req: AuthRequest, res) => {
    const databases = await Database.query()
    const severities = await Severity.query()

    // Ovoid repeating columns in schema
    const nonRepeatedColumns = Object.values<Column>(databases
      .flatMap(db => db.schema.flatMap(schema => schema.columns))
      .reduce((acc, curr) => {
        return {
          ...acc,
          [curr.name]: curr
        }
      }, {})
    )

    const alarmSchema = {
      type: 'object',
      required: ['database_id', 'table_name'],
      properties: {
        name: {
          type: 'string'
        },
        description: {
          type: 'string'
        },
        severity_id: {
          type: 'number',
          oneOf: severities.map(severity => ({
            const: severity.id,
            title: severity.description
          }))
        },
        enabled: { // titulo: Habilitar al crear
          type: 'boolean',
          oneOf: [
            { const: true, title: 'Yes' },
            { const: false, title: 'No' }
          ]
        },
        database_id: {
          type: 'integer',
          oneOf: databases.map(db => ({ const: db.id, title: db.name, description: db.description }))
        },
        table_name: { type: 'string', maxLength: 50 },
        condition: {
          type: 'array',
          items: {
            type: 'object',
            required: ['column_name', 'operator', 'value'],
            properties: {
              column_name: { type: 'string', maxLength: 50 },
              operator: {
                type: 'string',
                maxLength: 2,
                enum: ['=', '!=', '>', '<', '>=', '<=']
              },
              value: {
                type: ['string', 'number', 'boolean']
              }
            },
            dependencies: {
              column_name: {
                oneOf: nonRepeatedColumns.map(column => {
                  return {
                    properties: {
                      column_name: { const: column.name },
                      value: {
                        type: column.type
                      },
                      operator: {
                        enum: {
                          string: ['=', '!='],
                          number: ['=', '!=', '>', '<', '>=', '<='],
                          boolean: ['=', '!=']
                        }[column.type]
                      }
                    }
                  }
                })
              }
            }
          }
        }
      },
      dependencies: {
        database_id: {
          oneOf: databases.map(db => ({
            properties: {
              database_id: { const: db.id },
              table_name: {
                enum: db.schema.map(schema => schema.name)
              }
            }
          }))
        },
        table_name: {
          oneOf: databases.flatMap(db => {
            return db.schema.map(schema => ({
              properties: {
                table_name: { const: schema.name },
                condition: {
                  items: {
                    properties: {
                      column_name: {
                        enum: schema.columns.map(column => column.name)
                      }
                    }
                  }
                }
              }
            }))
          })
        }
      }
    }

    return res.json(alarmSchema)
  })
)
