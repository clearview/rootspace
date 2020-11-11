import { HttpError } from './HttpError'
import { HttpErrName, HttpStatusCode } from './types'

export class HttpValidationError extends HttpError {
  fields: any[]

  constructor(
    message: string,
    fields: any[],
    statusCode: HttpStatusCode = HttpStatusCode.BadRequest
  ) {
    super(message, HttpErrName.ValidationFailed, statusCode)
    this.fields = fields
  }

  response = (): any => {
    return {
      error: {
        name: this.name,
        message: this.message,
        fields: this.fields,
        stack: this.debug() ? this.stack.split('\n') : null,
      },
    }
  }
}
