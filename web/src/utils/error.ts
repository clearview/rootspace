export class FormError extends Error {
  fields: string[];

  constructor (message: string, fields: string[]) {
    super()

    this.message = message
    this.fields = fields

    this.stack = new Error().stack
  }
}
