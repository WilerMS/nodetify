import { verify } from 'jsonwebtoken'

import { User } from '@/models'
import { JWT_SECRET } from '@/config/env'
import { UnauthorizedError } from '@/errors'
import { errorHandler } from '@/middlewares'
import { type AuthenticatedRequest } from '@/types/global'

export const authenticateToken = errorHandler(async (
  req: AuthenticatedRequest,
  _res,
  next
) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1] || ''
  if (!token) {
    throw new UnauthorizedError('Invalid credentials')
  }

  let verifiedToken: { id: number }
  try {
    verifiedToken = verify(token, JWT_SECRET) as { id: number }
  } catch {
    throw new UnauthorizedError('Invalid credentials')
  }

  const user = await User.query().findById(verifiedToken.id)
  if (!user) {
    throw new UnauthorizedError('Invalid credentials')
  }

  req.auth = {
    ...req.auth,
    user: user.toResponse()
  }

  next()
})
