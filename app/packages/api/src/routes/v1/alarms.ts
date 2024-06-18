import { Router } from 'express'

import { Alarm } from '@/models'
import { withErrorHandling } from '@/utils'
import { NotFoundError } from '@/errors'

export const router = Router()
export const endpoint = '/alarms'

router.get('/', withErrorHandling(async (_req, res) => {
  const alarms = await Alarm.query()
  res.json(alarms)
}))

router.get('/:id', withErrorHandling(async (req, res) => {
  const { id } = req.params
  const alarm = await Alarm.query().findById(id).withGraphFetched('[severity, database, conditions, alerts]')
  if (!alarm) throw new NotFoundError('Alarm not found')
  return res.json(alarm)
}))

router.post('/', withErrorHandling(async (req, res) => {
  const { database_id, name, description, table_name, severity_id, enabled } = req.body
  const newAlarm = await Alarm.query().insert({
    database_id,
    name,
    description,
    table_name,
    severity_id,
    enabled
  })

  return res.status(201).json(newAlarm)
}))

router.patch('/:id', withErrorHandling(async (req, res) => {
  const { id } = req.params
  const { database_id, name, description, table_name, severity_id, enabled } = req.body

  const updated = await Alarm.query().findById(id).patch({
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
}))

router.delete('/:id', withErrorHandling(async (req, res) => {
  const { id } = req.params
  const deleted = await Alarm.query().deleteById(id)

  if (!deleted) throw new NotFoundError('Alarm not found')

  return res.json({ message: 'Alarm deleted successfully' })
}))
