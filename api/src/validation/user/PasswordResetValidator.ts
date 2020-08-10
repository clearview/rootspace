import { BaseValidator } from '../BaseValidator'

export class PasswordResetValidator extends BaseValidator {
  rules() {
    return {
      token: 'required',
      password: 'required|min:6|confirmed',
      password_confirmation: 'required|min:6',
    }
  }
}
