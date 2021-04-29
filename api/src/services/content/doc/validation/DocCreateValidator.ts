import { validations } from 'indicative/validator'
import { BaseValidator } from '../../../../root/validation'
import { DocAccess } from '../DocAccess'

export class DocCreateValidator extends BaseValidator {
  rules() {
    return {
      spaceId: 'required|number',
      title: 'required',
      content: 'required',
      access: [validations.required(), validations.in(Object.values(DocAccess))],
      isLocked: 'boolean',
    }
  }
}
