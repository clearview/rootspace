import { errNames } from './errNames'

export class HttpError extends Error {
  statusCode: number
  origin: Error

  constructor(
    message: string,
    statusCode = 400,
    name = errNames.httpError,
    origin = null
  ) {
    super(message)
    this.statusCode = statusCode
    this.name = name
    this.origin = origin
  }

  static fromError(
    err: Error,
    message = 'Internal error',
    statusCode = 500,
    name = errNames.internalError
  ) {
    return new HttpError(message, statusCode, name, err)
  }
}
