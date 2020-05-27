import { config } from 'node-config-ts'
import { ClientErrName, ClientStatusCode, ClientErrNames } from './types'

export class ClientError extends Error {
  statusCode: number

  constructor(
    message: string,
    name: ClientErrName  = ClientErrName.InvalidRequest,
    statusCode: ClientStatusCode = 400
  ) {
    super(message)
    this.name = name
    this.statusCode = statusCode
  }

  response() {
    return {
      error: {
        name: this.name,
        message: this.message,
        stack: config.env === 'dev' ? this.stack.split('\n') : null,
      },
    }
  }
}
