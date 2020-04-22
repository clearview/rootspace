import { BaseValidator } from '../BaseValidator'

export class SpaceValidator extends BaseValidator {
  rules() {
    return {
      title: 'required',
    }
  }
}
