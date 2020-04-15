import { ErrorNames } from './ErrorNames'
import { ResponseError } from './ResponseError'

export class ValidationError extends ResponseError {
  errorBag: any[]

  constructor(message: string, errorBag: any[], code = 400) {
    super(message, code, ErrorNames.validationError)
    this.errorBag = errorBag
  }
}
