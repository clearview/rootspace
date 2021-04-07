import { BaseValidator } from '../../root/validation/BaseValidator'

export class EmbedUpdateValidator extends BaseValidator {
  rules() {
    return {
      title: 'accepted',
      content: 'accepted',
    }
  }
}
