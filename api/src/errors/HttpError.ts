import { config } from 'node-config-ts'
import { HttpErrName, HttpStatusCode } from './types'

export class HttpError extends Error {
  statusCode: number

  constructor(
    message: string,
    name?: HttpErrName,
    statusCode?: HttpStatusCode
  ) {
    super(message)
    this.name = name ?? HttpErrName.InvalidRequest
    this.statusCode = statusCode ?? HttpStatusCode.BadRequest
  }

  response = (): any => {
    return {
      error: {
        name: this.name,
        message: this.message,
        stack: this.debug() ? this.stack.split('\n') : null,
      },
    }
  }

  protected debug = (): boolean => {
    return config.env !== 'production' ? true : false
  }
}
