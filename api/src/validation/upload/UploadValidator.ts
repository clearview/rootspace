import { BaseValidator } from '../BaseValidator'

export class UploadValidator extends BaseValidator {
  rules() {
    return {
      spaceId: 'required|number',
      entityId: 'required|number',
      entity: 'required|string',
      contentType: 'required|string',
      file: 'required|object',
    }
  }
}
