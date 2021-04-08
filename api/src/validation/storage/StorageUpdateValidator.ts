import { BaseValidator } from '../../root/validation/BaseValidator'

export class StorageUpdateValidator extends BaseValidator {
  rules() {
    return {
      title: 'accepted',
    }
  }
}
