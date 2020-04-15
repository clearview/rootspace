import { ErrorNames } from './ErrorNames'

export class ResponseError extends Error {
  code: number
  message: string
  origin: Error

  constructor(
    message: string,
    code = 400,
    name = ErrorNames.responseError,
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
    name = ErrorNames.responseError
  ) {
    return new ResponseError(message, code, name, err)
  }
}
