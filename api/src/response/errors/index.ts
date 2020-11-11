import { HttpErrName, HttpStatusCode } from './types'
import { HttpError } from './HttpError'
import { HttpValidationError } from './HttpValidationError'
import { HttpUnauthorizedError } from './HttpUnauthorizedError'

export * from './types'

export function clientError(
  message: string,
  name: HttpErrName = HttpErrName.InvalidRequest,
  statusCode: HttpStatusCode = HttpStatusCode.BadRequest
) {
  return new HttpError(message, name, statusCode)
}

export function unauthorized() {
  return new HttpUnauthorizedError()
}

export function validationFailed(message: string, fields: any, statusCode: HttpStatusCode = HttpStatusCode.BadRequest) {
  return new HttpValidationError(message, fields, statusCode)
}
