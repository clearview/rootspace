import { EntityValue, attributes } from '../../../root/values'
import { UploadAttributes } from './types'

export const attrs: UploadAttributes = {
  userId: null,
  spaceId: null,
  entityId: null,
  entity: null,
  type: null,
}

@attributes(attrs)
export class UploadValue extends EntityValue<UploadAttributes> {
  private _file: any = undefined

  get file(): any {
    return this._file
  }

  withFile(file: any): UploadValue {
    const copy = this.copy()
    copy._file = file

    return copy
  }

  private copy(): UploadValue {
    const copy = new UploadValue({ ...this.attributes })
    copy._file = this._file

    return copy
  }

  static fromObject(object: UploadAttributes): UploadValue {
    return new UploadValue(object)
  }

  static fromObjectAndUserId(object: UploadAttributes, userId: number): UploadValue {
    return UploadValue.fromObject(Object.assign({ ...object }, { userId }))
  }
}
