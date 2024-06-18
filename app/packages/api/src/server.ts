import './config-paths'
import path from 'path'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { PORT } from '@/config/env'
import { errorMiddleware } from '@/middlewares'
import { apiV1Router } from '@/routes/v1'

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

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`)
})
