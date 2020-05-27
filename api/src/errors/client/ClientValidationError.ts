import { config } from 'node-config-ts'
import { ClientError } from './ClientError'
import { ClientErrName, ClientStatusCode } from './types'

export class ClientValidationError extends ClientError {
  fields: any[]

  constructor(
    message: string,
    fields: any[],
    statusCode: ClientStatusCode = ClientStatusCode.BadRequest
  ) {
    super(message, ClientErrName.ValidationFailed, statusCode)
    this.fields = fields
  }

  toResponse = () => {
    return {
      error: {
        name: this.name,
        message: this.message,
        fields: this.fields,
        stack: config.env === 'dev' ? this.stack.split('\n') : null,
      },
    }
  }
}
