import { BaseValidator } from '../BaseValidator'

export class FolderCreateValidator extends BaseValidator {
  rules() {
    return {
      spaceId: 'required|number',
      title: 'required',
    }
  }
}
