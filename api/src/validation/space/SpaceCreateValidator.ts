import { BaseValidator } from '../BaseValidator'

export class SpaceCreateValidator extends BaseValidator {
  rules() {
    return {
      title: 'required',
    }
  }
}
