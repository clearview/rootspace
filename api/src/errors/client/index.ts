import { ClientErrName, ClientStatusCode } from './types'
import { ClientError } from './ClientError'
import { ClientValidationError } from './ClientValidationError'

export * from './types'

export function clientError(
  message: string,
  name: ClientErrName = ClientErrName.InvalidRequest,
  statusCode: ClientStatusCode = ClientStatusCode.BadRequest
) {
  return new ClientError(message, name, statusCode)
}

export function validationFailed(
  message: string,
  fields: any,
  statusCode: ClientStatusCode = ClientStatusCode.BadRequest
) {
  return new ClientValidationError(message, fields, statusCode)
}
