import { BaseValidator } from '../BaseValidator'

export class UploadValidator extends BaseValidator {
  rules() {
    return {
      spaceId: 'required|number',
      file: 'required|object'
    }
  }
}
