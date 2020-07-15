import { BaseValidator } from '../BaseValidator'

export class EmbedUpdateValidator extends BaseValidator {
  rules() {
    return {
      title: 'accepted',
      content: 'accepted',
    }
  }
}
