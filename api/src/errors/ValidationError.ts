import { errNames } from './errNames'
import { ResponseError } from './ResponseError'

export class ValidationError extends ResponseError {
  errorBag: any[]

  constructor(message: string, errorBag: any[], code = 400) {
    super(message, code, errNames.validationFailed)
    this.errorBag = errorBag
  }
}
