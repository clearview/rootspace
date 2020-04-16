import { clientError } from './httpErrors'

export class HttpClientError extends Error {
  statusCode: number
  constructor(message: string, name = clientError.invalidRequest, statusCode = 400) {
    super(message)
    this.name = name
    this.statusCode = statusCode
  }
}
