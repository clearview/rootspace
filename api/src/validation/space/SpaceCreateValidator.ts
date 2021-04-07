import { BaseValidator } from '../../root/validation/BaseValidator'

export class SpaceCreateValidator extends BaseValidator {
  rules() {
    return {
      title: 'required',
    }
  }
}
