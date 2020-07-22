type ValidationField = {
  message: string;
  validation: string;
  field: string;
}

type ValidationLabel = {
  [key: string]: string;
}

type ValidationParser = {
  [key: string]: (lable: string) => string;
}

export class ValidationError extends Error {
  fields: string[];

  static labels: ValidationLabel = {
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    password: 'Password',
    password_confirmation: 'Password Confirmation' // eslint-disable-line
  }

  static parser: ValidationParser = {
    dbUnique: label => `${label} is already exist`,
    required: label => `${label} is required`
  }

  constructor (message: string, fields: ValidationField[]) {
    super(message)

    this.fields = fields.map(
      ({ field, validation }: ValidationField) => {
        const label = ValidationError.labels[field]
        const parse = ValidationError.parser[validation]

        return parse(label)
      }
    )

    this.stack = new Error().stack
  }
}
