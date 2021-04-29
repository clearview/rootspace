import { BaseValidator } from '../../../root/validation/BaseValidator'

export class PasswordResetValidator extends BaseValidator {
  rules() {
    return {
      token: 'required | uuid',
      password: 'required|min:8|confirmed|compromisedPassword',
      password_confirmation: 'required|min:8',
    }
  }
}
