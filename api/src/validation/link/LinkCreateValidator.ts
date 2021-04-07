import { BaseValidator } from '../../root/validation/BaseValidator'

export class LinkCreateValidator extends BaseValidator {
  rules() {
    return {
      spaceId: 'required|number',
      title: 'required',
      value: 'required',
    }
  }
}
