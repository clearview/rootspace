import { validations } from 'indicative/validator'
import { BaseValidator } from '../../root/validation/BaseValidator'
import { UploadType, UploadEntity } from '../../types/upload'

export class UploadValidator extends BaseValidator {
  rules() {
    return {
      spaceId: [
        validations.number(),
        validations.requiredWhen(['type', UploadType.SpaceLogo]),
        validations.requiredWhen(['type', UploadType.TaskAttachment]),
      ],
      entityId: [validations.requiredWhen(['type', UploadType.TaskAttachment]), validations.number()],
      entity: [
        validations.requiredWhen(['type', UploadType.TaskAttachment]),
        validations.in(Object.values(UploadEntity)),
      ],
      type: [validations.required(), validations.in(Object.values(UploadType))],
      file: [validations.required(), validations.object()],
    }
  }
}
