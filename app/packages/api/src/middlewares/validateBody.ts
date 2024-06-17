import Ajv from 'ajv'
import { type JSONSchema } from 'objection'

import { BadRequestError } from '@/errors'
import { errorHandler } from '@/middlewares'

const ajv = new Ajv()

export const validateBody = (schema: JSONSchema) => {
  return errorHandler((req, _, next) => {
    const valid = ajv.validate(schema, req.body)

    if (!valid) {
      const errorArr = ajv.errors?.map(error => error.message)
      const error = errorArr?.join(', ')
      throw new BadRequestError(error)
    }

    next()
  })
}
