import { Router } from 'express'
import { Database } from '@/models'

import { withErrorHandling } from '@/utils'
import { NotFoundError } from '@/errors'

export const router = Router()
export const endpoint = '/databases'

router.get('/', withErrorHandling(async (_req, res) => {
  const databases = await Database.query()
  res.json(databases)
}))

router.get('/:id', withErrorHandling(async (req, res) => {
  const { id } = req.params
  const database = await Database.query().findById(id)
  if (!database) throw new NotFoundError('Database not found')
  return res.json(database)
}))

router.post('/', withErrorHandling(async (req, res) => {
  const { name, description, type, connection } = req.body
  const newDatabase = await Database.query().insert({
    name,
    description,
    type,
    connection
  })

  return res.status(201).json(newDatabase)
}))

router.patch('/:id', withErrorHandling(async (req, res) => {
  const { id } = req.params
  const { name, description, type, connection } = req.body

  const updated = await Database.query().findById(id).patch({
    name,
    description,
    type,
    connection
  })

  if (!updated) throw new NotFoundError('Database not found')

  const database = await Database.query().findById(id)

  return res.json(database)
}))

router.delete('/:id', withErrorHandling(async (req, res) => {
  const { id } = req.params
  const deleted = await Database.query().deleteById(id)

  if (!deleted) throw new NotFoundError('Database not found')

  return res.json({ message: 'Database deleted successfully' })
}))
