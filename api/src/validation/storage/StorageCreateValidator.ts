import { BaseValidator } from '../BaseValidator'

export class StorageCreateValidator extends BaseValidator {
  rules() {
    return {
      spaceId: 'required|number',
      title: 'required',
    }
  }
}
