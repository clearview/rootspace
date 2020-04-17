import { clientError } from './httpErrors'
import { HttpClientError } from './HttpClientError'

export class HttpValidationError extends HttpClientError {
  errorBag: any[]

  constructor(message: string, errorBag: any[], statusCode = 400) {
    super(message, clientError.validationFailed, statusCode)
    this.errorBag = errorBag
  }
}
