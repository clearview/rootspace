import { ClientErrName, ClientStatusCode } from './httpErrorProperty'

export class HttpClientError extends Error {
  statusCode: number
  constructor(
    message: string,
    name: ClientErrName = ClientErrName.InvalidRequest,
    statusCode: ClientStatusCode = 400
  ) {
    super(message)
    this.name = name
    this.statusCode = statusCode
  }
}
