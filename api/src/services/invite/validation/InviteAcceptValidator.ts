import { BaseValidator } from '../../../root/validation/BaseValidator'

export class InviteAcceptValidator extends BaseValidator {
  rules() {
    return {
      token: 'required'
    }
  }
}
