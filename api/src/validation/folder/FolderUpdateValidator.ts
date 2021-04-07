import { BaseValidator } from '../../root/validation/BaseValidator'

export class FolderUpdateValidator extends BaseValidator {
  rules() {
    return {
      title: 'accepted',
    }
  }
}
