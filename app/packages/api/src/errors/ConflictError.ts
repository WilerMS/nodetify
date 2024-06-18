import { ApiError } from './ApiError'

export default class ConflictError extends ApiError {
  constructor (message: string = '409 ConflictError') {
    super(409, message, 'ConflictError')
  }
}
