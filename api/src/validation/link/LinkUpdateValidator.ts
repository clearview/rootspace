import { BaseValidator } from '../BaseValidator'

export class LinkUpdateValidator extends BaseValidator {
  rules() {
    return {
      title: 'accepted',
      value: 'accepted',
      position: 'number|above:0'
    }
  }
}
