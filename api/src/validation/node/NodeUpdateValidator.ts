import { BaseValidator } from '../../root/validation/BaseValidator'

export class NodeUpdateValidator extends BaseValidator {
  rules() {
    return {
      title: 'accepted',
      position: 'number|above:0',
    }
  }
}
