import { BaseValidator } from '../BaseValidator'

export class PasswordRecoveryValidator extends BaseValidator {
  rules() {
    return {
      email: 'required|email',
    }
  }
}
