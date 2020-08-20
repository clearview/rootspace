import { BaseValidator } from '../BaseValidator'

export class ChangePasswordValidator extends BaseValidator {
  rules() {
    return {
      password: 'required',
      newPassword: 'required|min:8|confirmed|compromisedPassword',
      newPassword_confirmation: 'required|min:8',
    }
  }
}
