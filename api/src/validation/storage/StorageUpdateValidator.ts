import { BaseValidator } from '../BaseValidator'

export class StorageUpdateValidator extends BaseValidator {
  rules() {
    return {
      title: 'accepted',
    }
  }
}
