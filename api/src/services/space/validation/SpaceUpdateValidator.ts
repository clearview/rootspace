import { BaseValidator } from '../../../root/validation/BaseValidator'

export class SpaceUpdateValidator extends BaseValidator {
  rules() {
    return {
      title: 'accepted',
    }
  }
}
