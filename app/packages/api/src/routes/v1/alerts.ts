import { Router } from 'express'

import { Alert } from '@/models'
import { NotFoundError } from '@/errors'
import { errorHandler } from '@/middlewares'

const router = Router()

router.get('/', errorHandler(async (_req, res) => {
  const alerts = await Alert.query()
  res.json(alerts)
}))

router.get('/:id', errorHandler(async (req, res) => {
  const { id } = req.params
  const alert = await Alert.query().findById(id).withGraphFetched('[alarm, severity]')
  if (!alert) throw new NotFoundError('Alert not found')
  return res.json(alert)
}))

router.post('/', errorHandler(async (req, res) => {
  const { alarm_id, message, severity_id, status, resolved_at, info } = req.body
  const newAlert = await Alert.query().insert({
    alarm_id,
    message,
    severity_id,
    status,
    resolved_at,
    info
  })

  return res.status(201).json(newAlert)
}))

router.put('/:id', errorHandler(async (req, res) => {
  const { id } = req.params
  const { alarm_id, message, severity_id, status, resolved_at, info } = req.body

  const updated = await Alert.query().findById(id).patch({
    alarm_id,
    message,
    severity_id,
    status,
    resolved_at,
    info
  })

  if (!updated) throw new NotFoundError('Alert not found')

  const alert = await Alert.query().findById(id).withGraphFetched('[alarm, severity]')

  return res.json(alert)
}))

router.delete('/:id', errorHandler(async (req, res) => {
  const { id } = req.params
  const deleted = await Alert.query().deleteById(id)

  if (!deleted) throw new NotFoundError('Alert not found')

  return res.json({ message: 'Alert deleted successfully' })
}))

export default router
