import { BaseValidator } from '../BaseValidator'

export class EmbedCreateValidator extends BaseValidator {
  rules() {
    return {
      spaceId: 'required|number',
      title: 'required',
      content: 'required',
    }
  }
}
