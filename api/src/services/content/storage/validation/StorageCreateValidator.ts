import { BaseValidator } from '../../../../root/validation/BaseValidator'

export class StorageCreateValidator extends BaseValidator {
  rules() {
    return {
      spaceId: 'required|number',
      title: 'required',
    }
  }
}
