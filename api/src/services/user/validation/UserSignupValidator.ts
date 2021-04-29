import { validations } from 'indicative/validator'
import { BaseValidator } from '../../../root/validation/BaseValidator'

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
      password_confirmation: 'required|min:8',
    }
  }
}
