import { validations } from 'indicative/validator'
import { BaseValidator } from '../BaseValidator'

export class UserSignupValidator extends BaseValidator {
  rules() {
    return {
      firstName: 'required',
      lastName: 'required',
      email: [
        validations.required(),
        validations.email(),
        validations.dbUnique(['User', 'user', 'email']),
      ],
      password: 'required|min:8|confirmed|compromisedPassword',
      passwordConfirmation: 'required|min:8',
    }
  }
}
