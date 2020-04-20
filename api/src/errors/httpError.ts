import { ClientErrName, ClientStatusCode } from './httpErrorProperty'
import { HttpClientError } from './HttpClientError'
import { HttpValidationError } from './HttpValidationError'

export function clientError(
  message: string,
  name: ClientErrName,
  statusCode: ClientStatusCode = ClientStatusCode.BadRequest
) {
  return new HttpClientError(message, name, statusCode)
}

export function validationFailed(
  message: string,
  fields: any,
  statusCode: ClientStatusCode = ClientStatusCode.BadRequest
) {
  return new HttpValidationError(message, fields, statusCode)
}
