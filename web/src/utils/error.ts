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
   fields: string[] = []

  static labels: ValidationLabel = {
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    password: 'Password',
    newPassword: 'New Password',
    password_confirmation: 'Password Confirmation' // eslint-disable-line
  }

  static parser: ValidationParser = {
    dbUnique: label => `${label} is already exist`,
    required: label => `${label} is required`,
    min: label => `${label} should contain at least 8 characters`,
    compromisedPassword: label => `${label} is weak and can be easily guessed`
  }

  constructor (message: string, fields: ValidationField[]) {
    super(message.includes('invalid input syntax for type uuid') ? 'Invalid Token' : message)

    if (fields) {
      this.fields = fields.map(
        ({ field, validation }: ValidationField) => {
          const label = ValidationError.labels[field]
          const parse = ValidationError.parser[validation]

          return parse(label)
        }
      )
    }

    this.stack = new Error().stack
  }
}
