import { BaseValidator } from '../BaseValidator'

export class ChangePasswordValidator extends BaseValidator {
  rules() {
    return {
      password: 'required',
      newPassword: 'required|min:6|confirmed',
      newPassword_confirmation: 'required|min:6',
    }
  }
}
