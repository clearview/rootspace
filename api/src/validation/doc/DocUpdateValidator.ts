import { validations } from 'indicative/validator'
import { BaseValidator } from '../BaseValidator'
import { DocAccess } from '../../constants'

export class DocUpdateValidator extends BaseValidator {
  rules() {
    return {
      title: 'accepted',
      content: 'object',
      access: [
        validations.in(Object.values(DocAccess)),
      ],
    }
  }
}
