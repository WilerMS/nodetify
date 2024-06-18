import Ajv from 'ajv'
import { type JSONSchema } from 'objection'

import { BadRequestError } from '@/errors'
import { withErrorHandling } from '@/utils'

const ajv = new Ajv()

export const validateBody = (schema: JSONSchema) => {
  return withErrorHandling((req, _, next) => {
    const valid = ajv.validate(schema, req.body)

    if (!valid) {
      const errorArr = ajv.errors?.map(error => error.message)
      const error = errorArr?.join(', ')
      throw new BadRequestError(error)
    }

    next()
  })
}
