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
    newPassword_confirmation: 'New Password Confirmation', // eslint-disable-line
    password_confirmation: 'Password Confirmation' // eslint-disable-line
  }

  static parser: ValidationParser = {
    dbUnique: label => `${label} already exist within the app.`,
    required: label => `${label} is required.`,
    accepted: label => `${label} is required.`,
    min: label => `Please use a ${label} that is at least 8 characters long.`,
    confirmed: label => `${label} doesn't match.`,
    compromisedPassword: label => `This is a commonly used ${label}, please enter something harder to gues.`
  }

  constructor (message: string, fields: ValidationField[]) {
    super(message.includes('invalid input syntax for type uuid') ? 'The token is invalid' : message)

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
