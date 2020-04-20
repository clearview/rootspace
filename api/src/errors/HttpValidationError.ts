import { ClientErrName, ClientStatusCode } from './httpErrorProperty'
import { HttpClientError } from './HttpClientError'

export class HttpValidationError extends HttpClientError {
  fields: any[]

  constructor(
    message: string,
    fields: any[],
    statusCode: ClientStatusCode = ClientStatusCode.BadRequest
  ) {
    super(message, ClientErrName.ValidationFailed, statusCode)
    this.fields = fields
  }
}
