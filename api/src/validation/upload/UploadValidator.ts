import { validations } from 'indicative/validator'
import { BaseValidator } from '../BaseValidator'
import { UploadType, UploadEntity } from '../../types/upload'
export class UploadValidator extends BaseValidator {
  rules() {
    return {
      spaceId: 'number',
      entityId: 'required|number',
      entity: [validations.required(), validations.in(Object.values(UploadEntity))],
      type: [validations.required(), validations.in(Object.values(UploadType))],
      file: 'required|object',
    }
  }
}
