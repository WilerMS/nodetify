import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { User } from '@/models/User'
import { JWT_SECRET } from '@/config/env'
import { delay, withErrorHandling } from '@/utils'
import { authenticateToken, validateBody } from '@/middlewares'
import { BadRequestError, ConflictError, UnauthorizedError } from '@/errors'
import { type AuthenticatedRequest } from '@/types/global'

type LoginBodyType = Pick<User, 'username' | 'password'>
type RegisterBodyType = Pick<User, 'name' | 'username' | 'password' | 'email'>

export const router = Router()
export const endpoint = '/auth'

router.post(
  '/login',
  validateBody(User.loginJsonSchema),
  withErrorHandling(async (req, res) => {
    const { username, password } = req.body as LoginBodyType

    const user = await User.query().findOne({ username })
    if (!user) throw new UnauthorizedError('Invalid credentials')

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) throw new UnauthorizedError('Invalid credentials')

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      {
        expiresIn: '2h'
      }
    )

    await delay(2000)

    return res
      .cookie('access_token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 2 })
      .json({ token, user: user.toResponse() })
  })
)

router.post(
  '/register',
  validateBody(User.registerJsonSchema),
  withErrorHandling(async (req, res) => {
    const { name, username, password, email } = req.body as RegisterBodyType

    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      throw new BadRequestError('Invalid username.')
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new BadRequestError('Invalid email.')
    }

    const existingUser = await User.query().findOne({ username })
    if (existingUser) {
      throw new ConflictError('Provided username is not available.')
    }

    const existingEmail = await User.query().findOne({ email })
    if (existingEmail) {
      throw new ConflictError('Provided email is being used by another user.')
    }

    await delay(2000)

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await User
      .query()
      .insert({ name, username, email, password: hashedPassword })

    return res.json({
      message: 'User successfully created',
      user: newUser.toResponse()
    })
  })
)

router.patch(
  '/users/:id(\\d+)',
  authenticateToken,
  validateBody(User.jsonSchema),
  withErrorHandling(async (req: AuthenticatedRequest, res) => {
    const { name, username, password, birth_date, image } = req.body as User
    const { id } = req.params

    if (req.auth?.user.id !== Number(id)) {
      throw new UnauthorizedError("You don't have access to these resources")
    }

    const existingUser = await User.query().findById(id)
    if (!existingUser) throw new ConflictError('User not found')

    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined

    const [updatedUser] = await User
      .query()
      .findById(id)
      .patch({ name, username, password: hashedPassword, birth_date, image })
      .returning('*')

    return res.json({
      message: 'User successfully updated',
      user: updatedUser.toResponse()
    })
  })
)

router.get(
  '/users/:id(\\d+)',
  authenticateToken,
  withErrorHandling(async (req: AuthenticatedRequest, res) => {
    const { id } = req.params

    if (req.auth?.user.id !== Number(id)) {
      throw new UnauthorizedError("You don't have access to this resources")
    }

    const existingUser = await User.query().findById(id)
    if (!existingUser) {
      throw new ConflictError('User not found')
    }

    return res.json({
      user: existingUser.toResponse()
    })
  })
)
