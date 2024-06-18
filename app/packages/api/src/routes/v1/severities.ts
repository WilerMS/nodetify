import { Router } from 'express'

import { Severity } from '@/models'
import { NotFoundError } from '@/errors'
import { withErrorHandling } from '@/utils'

export const router = Router()
export const endpoint = '/severities'

router.get('/', withErrorHandling(async (_, res) => {
  const severities = await Severity.query()
  return res.json(severities)
}))

router.get('/:id', withErrorHandling(async (req, res) => {
  const { id } = req.params
  const severity = await Severity.query().findById(id)
  if (!severity) throw new NotFoundError('Severity not found')
  return res.json(severity)
}))

router.post('/', withErrorHandling(async (req, res) => {
  const { description, level, color } = req.body
  const newSeverity = await Severity.query().insert({
    description,
    level,
    color
  })

  return res.status(201).json(newSeverity)
}))

router.patch('/:id', withErrorHandling(async (req, res) => {
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

router.delete('/:id', withErrorHandling(async (req, res) => {
  const { id } = req.params
  const deleted = await Severity.query().deleteById(id)

  if (!deleted) throw new NotFoundError('Not Found Severity')

  return res.json({ message: 'Severity deleted successfully' })
}))
