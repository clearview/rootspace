import { BaseValidator } from '../BaseValidator'

export class InviteAcceptValidator extends BaseValidator {
  rules() {
    return {
      token: 'required'
    }
  }
}
