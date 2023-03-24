import { validations } from 'indicative/validator'
import { BaseValidator } from '../../../root/validation/BaseValidator'
import { SpaceUserRole } from '../SpaceUserRole'

export class SpaceUserUpdateValidator extends BaseValidator {
  rules() {
    return {
      role: [validations.number(), validations.in(Object.values(SpaceUserRole))],
    }
  }
}
