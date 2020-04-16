import { errNames } from './errNames'
import { HttpError } from './HttpError'

export class ValidationError extends HttpError {
  errorBag: any[]

  constructor(message: string, errorBag: any[], statusCode = 400) {
    super(message, statusCode, errNames.validationFailed)
    this.errorBag = errorBag
  }
}
