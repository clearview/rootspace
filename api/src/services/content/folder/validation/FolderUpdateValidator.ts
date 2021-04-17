import { BaseValidator } from '../../../../root/validation'

export class FolderUpdateValidator extends BaseValidator {
  rules() {
    return {
      title: 'accepted',
    }
  }
}
