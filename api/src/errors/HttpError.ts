export class HttpError extends Error {
  static ErrorName = 'HttpError'
  code: number
  message: string

  constructor(code: number, message: string) {
    super(message)
    this.code = code
    this.message = message
    this.name = HttpError.ErrorName
  }
}
