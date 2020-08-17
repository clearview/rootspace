import { BaseValidator } from '../BaseValidator'
import { validations } from 'indicative/validator'

export class PasswordResetValidator extends BaseValidator {
  rules() {
    return {
      token: 'required',
      password: 'required|min:8|confirmed|compromised',
      password_confirmation: 'required|min:8',
    }
  }
}
