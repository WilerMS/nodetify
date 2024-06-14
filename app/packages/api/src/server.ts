import { config } from 'dotenv'
import './config-paths'
import { PORT } from '@/constants/env'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import path from 'path'

import { errorHandler, errorMiddleware } from '@/middlewares'

config()

const app = express()

// Middlewares
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

const publicUrl = path.join(__dirname, '../../', 'web/dist')
app.use(express.static(publicUrl))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, publicUrl, 'index.html'))
})

// Api Routes
app.get('/api/test', errorHandler((req, res) => {
  return res.json({ message: 'Hola' })
}))

// Error handling
app.use(errorMiddleware)

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`)
})
