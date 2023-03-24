import { validations } from 'indicative/validator'
import { BaseValidator } from '../../../root/validation/BaseValidator'
import { UploadType } from '../UploadType'

export class UploadValidator extends BaseValidator {
  rules() {
    return {
      spaceId: [validations.number(), validations.requiredWhen(['type', UploadType.SpaceLogo])],
      entityId: [
        validations.number(),
        validations.requiredWhen(['type', UploadType.TaskAttachment]),
        validations.requiredWhen(['type', UploadType.DocContent]),
        validations.requiredWhen(['type', UploadType.Storage]),
      ],
      type: [validations.required(), validations.in(Object.values(UploadType))],
      file: [validations.required(), validations.object()],
    }
  }
}
