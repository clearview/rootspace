import { BaseValidator } from '../../../root/validation/BaseValidator'

export class PasswordChangeValidator extends BaseValidator {
  rules() {
    return {
      password: 'required',
      newPassword: 'required|min:8|confirmed|compromisedPassword',
      newPassword_confirmation: 'required|min:8',
    }
  }
}