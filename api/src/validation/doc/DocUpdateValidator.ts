import { validations } from 'indicative/validator'
import { BaseValidator } from '../BaseValidator'
import { DocAccess } from '../../constants'

export class DocUpdateValidator extends BaseValidator {
  rules() {
    return {
      title: 'required',
      content: 'required',
      access: [
        validations.required(),
        validations.in(Object.values(DocAccess)),
      ],
    }
  }
}
