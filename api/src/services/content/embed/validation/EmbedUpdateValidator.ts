import { BaseValidator } from '../../../../root/validation'

export class EmbedUpdateValidator extends BaseValidator {
  rules() {
    return {
      title: 'accepted',
      content: 'accepted',
    }
  }
}
