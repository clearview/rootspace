import { HttpError } from './HttpError'
import { HttpErrName, HttpStatusCode } from './types'

export class HttpUnauthorizedError extends HttpError {
  constructor() {
    super('Unauthorized', HttpErrName.Unauthorized, HttpStatusCode.Unauthorized)
  }

  response = (): any => {
    return {
      error: {
        name: this.name,
        message: this.message
      }
    }
  }
}
