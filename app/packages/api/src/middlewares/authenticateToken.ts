import { verify } from 'jsonwebtoken'

import { User } from '@/models'
import { JWT_SECRET } from '@/config/env'
import { UnauthorizedError } from '@/errors'
import { withErrorHandling } from '@/utils'
import { type AuthRequest } from '@/types/global'

export const authenticateToken = withErrorHandling(async (
  req: AuthRequest,
  _res,
  next
) => {
  const accessToken = ((): string | null => {
    if (!req.cookies?.acces_token && !req.headers.authorization) return null
    if (req.cookies.acces_token) return req.cookies.acces_token
    if (req.headers.authorization) return req.headers.authorization?.split(' ')[1] || null
    return null
  })()

  if (!accessToken) throw new UnauthorizedError('Invalid credentials')

  let verifiedToken: { id: number }
  try {
    verifiedToken = verify(accessToken, JWT_SECRET) as { id: number }
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
