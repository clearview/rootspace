import { BaseValidator } from '../../../root/validation/BaseValidator'

export class PasswordRecoveryValidator extends BaseValidator {
  rules() {
    return {
      email: 'required|email',
    }
  }
}
