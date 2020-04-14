import { HttpError } from './HttpError'

export class ValidationError extends HttpError {
  static ErrorName = 'ValidationError'
  errorBag: any[]

  constructor(code: number, message: string, errorBag: any[]) {
    super(code, message)
    this.errorBag = errorBag
    this.name = ValidationError.ErrorName
  }
}
