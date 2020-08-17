import { BaseValidator } from '../BaseValidator'

export class InviteCancelValidator extends BaseValidator {
  rules() {
    return {
      inviteId: 'required|number'
    }
  }
}
