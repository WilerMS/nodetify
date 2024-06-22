import { type Request, type Response, type NextFunction } from 'express'
import { ApiError } from '@/errors'
import { UniqueViolationError } from 'objection'

// @ts-expect-error: typescript version maybe does not suppor ListFormat
const formatter = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' })

export const errorMiddleware = (
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res
      .status(err.status)
      .json({
        status: err.status,
        error: true,
        name: err.name,
        message: err.message
      })
  }

  if (err instanceof UniqueViolationError) {
    const { columns } = err

    const columnsStr = formatter.format(columns)
    const errorMsg = `${columns.length > 1 ? 'These' : 'This'} ${columnsStr} already exist.`

    return res
      .status(400)
      .json({
        status: 400,
        error: true,
        name: 'BadRequestError',
        message: errorMsg
      })
  }

  res
    .status(500)
    .json({
      status: 500,
      error: true,
      name: 'InternalServerError',
      message: 'Something went wrong. Try again later.'
    })
}
