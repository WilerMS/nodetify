import './config-paths'
import path from 'path'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { PORT } from '@/config/env'
import { errorMiddleware } from '@/middlewares'
import { apiV1Router } from '@/routes/v1'

import { Alarm, Database } from '@/models'
import { DatabaseService } from '@/services/db-service'
import { AlarmService } from '@/services/alarms-service'

const main = async () => {
  const app = express()

  // Middlewares
  app.use(cors())
  app.use(morgan('dev'))
  app.use(express.json())
  app.use(cookieParser())

  // static files
  const publicUrl = path.join(__dirname, '../../', 'web/dist')
  app.use(express.static(publicUrl))

  app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, publicUrl, 'index.html'))
  })

  // authentication

  // api Routes
  app.use('/api/v1', apiV1Router)

  // Error handling
  app.use(errorMiddleware)

  // SERVICES
  const alarms = await Alarm.query().withGraphFetched('[condition]')
  const alarmService = new AlarmService(alarms)
  const databaseService = new DatabaseService(alarmService, Database)

  app.set('AlarmService', alarmService)
  app.set('DatabaseService', databaseService)

  databaseService.start()

  // TODO: Iniciar el servicio de alarmas, pasandole el databaseSevice para que use las conexiones
  // TODO: Ahí dentro tengo que tener métodos o algo así para inyectar los triggers de las alarmas
  // TODO: Engancharme al evento "client.notification" y ejecutar un método que procese las alarmas
  // TODO: Idear un servicio o proceso que haga la notificación a la aplicación web (websocket???)
  // TODO: Quizas renta tener un redis para el facil acceso a las alarmas desde la app?

  app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
  })

  return app
}

main()
