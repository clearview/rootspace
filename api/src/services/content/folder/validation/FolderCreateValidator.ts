import { BaseValidator } from '../../../../root/validation'

export class FolderCreateValidator extends BaseValidator {
  rules() {
    return {
      spaceId: 'required|number',
      title: 'required',
    }
  }
}
