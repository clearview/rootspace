import { BaseValidator } from '../BaseValidator'

export class PasswordChangeValidator extends BaseValidator {
  rules() {
    return {
      password: 'required',
      newPassword: 'required|min:8|confirmed|compromisedPassword',
      newPasswordConfirmation: 'required|min:8',
    }
  }
}