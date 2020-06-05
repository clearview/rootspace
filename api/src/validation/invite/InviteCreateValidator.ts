import { BaseValidator } from '../BaseValidator'

export class InviteCreateValidator extends BaseValidator {
  rules() {
    return {
      spaceId: 'required|number',
      emails: 'required|array',
    }
  }
}
