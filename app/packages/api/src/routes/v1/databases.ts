import { Router } from 'express'

import { Database } from '@/models'
import { withErrorHandling } from '@/utils'
import { NotFoundError } from '@/errors'
import { authenticateToken } from '@/middlewares'
import { type AuthRequest } from '@/types/global'

export const router = Router()
export const endpoint = '/databases'

router.get(
  '/',
  authenticateToken,
  withErrorHandling(async (req: AuthRequest, res) => {
    const databases = await Database
      .query()
      .where({
        user_id: req.auth!.user.id
      })

    return res.json(databases)
  })
)

router.get(
  '/:id',
  authenticateToken,
  withErrorHandling(async (req: AuthRequest, res) => {
    const { id } = req.params
    const database = await Database
      .query()
      .findById(id)
      .where({
        user_id: req.auth!.user.id
      })

    if (!database) throw new NotFoundError('Database not found')

    return res.json(database)
  })
)

router.post(
  '/',
  authenticateToken,
  withErrorHandling(async (req: AuthRequest, res) => {
    const { name, description, type, connection } = req.body
    const newDatabase = await Database
      .query()
      .insert({
        name,
        description,
        type,
        connection,
        user_id: req.auth!.user.id
      })

    return res.status(201).json(newDatabase)
  })
)

router.patch(
  '/:id',
  authenticateToken,
  withErrorHandling(async (req: AuthRequest, res) => {
    const { id } = req.params
    const { name, description, type, connection } = req.body

    const existDatabase = await Database
      .query()
      .findById(id)
      .where({
        user_id: req.auth!.user.id
      })

    if (!existDatabase) throw new NotFoundError('Database not found')

    const updated = await Database
      .query()
      .findById(id)
      .patch({
        name,
        description,
        type,
        connection
      })
      .returning('*')

    return res.json(updated)
  })
)

router.delete(
  '/:id',
  authenticateToken,
  withErrorHandling(async (req: AuthRequest, res) => {
    const { id } = req.params

    const existDatabase = await Database
      .query()
      .findById(id)
      .where({
        user_id: req.auth!.user.id
      })

    if (!existDatabase) throw new NotFoundError('Database not found')

    await Database.query().deleteById(id)

    return res.json({ message: 'Database deleted successfully' })
  })
)
