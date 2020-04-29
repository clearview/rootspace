import { BaseValidator } from '../BaseValidator'

export class DocCreateValidator extends BaseValidator {
  rules() {
    return {
      spaceId: 'required',
      title: 'required',
      content: 'required',
      access: 'required|number',
    }
  }
}