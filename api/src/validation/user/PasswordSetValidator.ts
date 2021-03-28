import { BaseValidator } from '../../root/validation/BaseValidator'

export class PasswordSetValidator extends BaseValidator {
  rules() {
    return {
      newPassword: 'required|min:8|confirmed|compromisedPassword',
      newPassword_confirmation: 'required|min:8',
    }
  }
}
