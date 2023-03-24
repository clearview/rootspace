import { BaseValidator } from '../../../../root/validation'

export class EmbedCreateValidator extends BaseValidator {
  rules() {
    return {
      spaceId: 'required|number',
      title: 'required',
      content: 'required',
    }
  }
}
