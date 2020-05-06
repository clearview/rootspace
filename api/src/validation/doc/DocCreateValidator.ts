import { validations } from 'indicative/validator'
import { BaseValidator } from '../BaseValidator'
import { DocAccess } from '../../constants'

export class DocCreateValidator extends BaseValidator {
  rules() {
    return {
      spaceId: 'required|number',
      title: 'required',
      content: 'required',
      access: [
        validations.required(),
        validations.in(Object.values(DocAccess)),
      ],
    }
  }
}
