import { BaseValidator } from '../BaseValidator'

export class PasswordSetValidator extends BaseValidator {
  rules() {
    return {
      newPassword: 'required|min:8|confirmed|compromisedPassword',
      newPasswordConfirmation: 'required|min:8',
    }
  }
}
