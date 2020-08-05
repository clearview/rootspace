import { BaseValidator } from '../BaseValidator'

export class PasswordRecovery extends BaseValidator {
  rules() {
    return {
      email: 'required|email',
    }
  }
}
