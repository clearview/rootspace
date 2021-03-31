import { BaseValidator } from '../BaseValidator'

export class PasswordResetValidator extends BaseValidator {
  rules() {
    return {
      token: 'required | uuid',
      password: 'required|min:8|confirmed|compromisedPassword',
      passwordConfirmation: 'required|min:8',
    }
  }
}
