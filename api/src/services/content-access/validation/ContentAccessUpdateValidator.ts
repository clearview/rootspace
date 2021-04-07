import { validations } from 'indicative/validator'
import { BaseValidator } from '../../../root/validation/BaseValidator'
import { ContentAccessType } from '../ContentAccessType'

export class ContentAccessUpdateValidator extends BaseValidator {
  rules() {
    return {
      type: [validations.in(Object.values(ContentAccessType))],
      public: 'boolean',
    }
  }
}
