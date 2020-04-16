import { errNames } from './errNames'

export class ResponseError extends Error {
  code: number
  message: string
  origin: Error

  constructor(
    message: string,
    code = 400,
    name = errNames.responseError,
    origin = null
  ) {
    super(message)
    this.code = code
    this.name = name
    this.origin = origin
  }

  static fromError(
    err: Error,
    message = 'Internal error',
    code = 500,
    name = errNames.internalError
  ) {
    return new ResponseError(message, code, name, err)
  }
}
