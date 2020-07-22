import { BaseValidator } from '../BaseValidator'

export class SpaceUpdateValidator extends BaseValidator {
  rules() {
    return {
      title: 'accepted',
    }
  }
}
