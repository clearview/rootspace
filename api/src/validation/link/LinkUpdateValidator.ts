import { BaseValidator } from '../BaseValidator'

export class LinkUpdateValidator extends BaseValidator {
  rules() {
    return {
      title: 'required_if:title',
      value: 'required_if:value',
    }
  }
}
