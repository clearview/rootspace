import { validations } from 'indicative/validator'
import { BaseValidator } from '../BaseValidator'
import { UploadType } from '../../types/upload'
export class UploadValidator extends BaseValidator {
  rules() {
    return {
      spaceId: 'required|number',
      entityId: 'required|number',
      entity: 'required|string',
      type: [validations.required(), validations.in(Object.values(UploadType))],
      file: 'required|object',
    }
  }
}
