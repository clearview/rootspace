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
        validations.unique(['User', 'user', 'email']),
      ],
      password: 'required|min:6|confirmed',
      password_confirmation: 'required|min:6',
    }
  }
}
