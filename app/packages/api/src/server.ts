import './config-paths'
import path from 'path'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { PORT } from '@/config/env'
import { errorMiddleware } from '@/middlewares'
import { apiV1Router } from '@/routes/v1'
import { startDbService } from './services/db-service'
import { Database } from './models'

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

  // TODO: Refactor this code and move it to separated functions
  startDbService({
    events: {
      onClientConnected: async (conn) => {
        const schema = await conn.getSchema()
        const data = {
          schema: JSON.stringify(schema),
          status: 'active' as const,
          last_checked_at: new Date().toISOString()
        }
        await Database.query().findById(conn.id).patch(data)
      },
      onClientNotification: (notification) => {

      },
      onCheckConnectionSuccess: async (conn) => {
        const schema = await conn.getSchema()
        const data = {
          schema: JSON.stringify(schema),
          status: 'active' as const,
          last_checked_at: new Date().toISOString()
        }
        await Database.query().findById(conn.id).patch(data)
      },
      onClientError: async (conn) => {
        const data = {
          status: 'error' as const,
          last_checked_at: new Date().toISOString()
        }
        await Database.query().findById(conn.id).patch(data)
      },
      onCheckConnectionError: async (conn) => {
        const data = {
          status: 'error' as const,
          last_checked_at: new Date().toISOString()
        }
        await Database.query().findById(conn.id).patch(data)
      }
    }
  })

  app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
  })

  return app
}

main()
