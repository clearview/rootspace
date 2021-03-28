import { BaseValidator } from '../../root/validation/BaseValidator'

export class InviteCreateValidator extends BaseValidator {
  rules() {
    return {
      spaceId: 'required|number',
      invites: 'required|array',
    }
  }
}
