import { BaseValidator } from '../../root/validation/BaseValidator'

export class LinkUpdateValidator extends BaseValidator {
  rules() {
    return {
      title: 'accepted',
      value: 'accepted',
      position: 'number|above:0'
    }
  }
}
