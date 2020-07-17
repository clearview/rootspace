import { BaseValidator } from '../BaseValidator'

export class FolderUpdateValidator extends BaseValidator {
  rules() {
    return {
      title: 'accepted',
    }
  }
}
