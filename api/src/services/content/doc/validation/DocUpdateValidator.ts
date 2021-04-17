import { validations } from 'indicative/validator'
import { BaseValidator } from '../../../../root/validation'
import { DocAccess } from '../../../../types/doc'

export class DocUpdateValidator extends BaseValidator {
  rules() {
    return {
      title: 'accepted',
      content: 'object',
      access: [validations.in(Object.values(DocAccess))],
      isLocked: 'boolean',
    }
  }
}
