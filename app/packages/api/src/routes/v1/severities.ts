import { Router } from 'express'

import { Severity } from '@/models'
import { errorHandler } from '@/middlewares'
import { NotFoundError } from '@/errors'

const router = Router()

router.get('/', errorHandler(async (_req, res) => {
  const severities = await Severity.query()
  res.json(severities)
}))

router.get('/:id', errorHandler(async (req, res) => {
  const { id } = req.params
  const severity = await Severity.query().findById(id)
  if (!severity) throw new NotFoundError('Severity not found')
  return res.json(severity)
}))

router.post('/', errorHandler(async (req, res) => {
  const { description, level, color } = req.body
  const newSeverity = await Severity.query().insert({
    description,
    level,
    color
  })

  return res.status(201).json(newSeverity)
}))

router.patch('/:id', errorHandler(async (req, res) => {
  const { id } = req.params
  const { description, level, color } = req.body
  const updated = await Severity.query().findById(id).patch({
    description,
    level,
    color
  })

  if (!updated) throw new NotFoundError('Not Found Severity')

  const severity = await Severity.query().findById(id)

  return res.json(severity)
}))

router.delete('/:id', errorHandler(async (req, res) => {
  const { id } = req.params
  const deleted = await Severity.query().deleteById(id)

  if (!deleted) throw new NotFoundError('Not Found Severity')

  return res.json({ message: 'Severity deleted successfully' })
}))

export default router
