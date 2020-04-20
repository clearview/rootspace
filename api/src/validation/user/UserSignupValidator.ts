import { validations } from 'indicative/validator'
import { BaseValidator } from '../BaseValidator'

export class UserSignupValidator extends BaseValidator {
  rules() {
    return {
      name: 'required',
      email: [
        validations.required(),
        validations.email(),
        validations.unique(['User', 'user', 'email']),
      ],
      password: 'required|min:6',
      password_confirmation: 'required|min:6',
    }
  }
}
