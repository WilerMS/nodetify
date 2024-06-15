import './config-paths'
import { PORT } from '@/config/env'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import path from 'path'

import { Example } from '@/models/Example'
import { errorHandler, errorMiddleware } from '@/middlewares'

const app = express()

// Middlewares
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

const publicUrl = path.join(__dirname, '../../', 'web/dist')
app.use(express.static(publicUrl))

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, publicUrl, 'index.html'))
})

// Api Routes
app.get('/api/test', errorHandler(async (_req, res) => {
  const [data] = await Example.query().select('*')

  return res.json({ message: data.message })
}))

// Error handling
app.use(errorMiddleware)

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`)
})
