import { EntityValue, attributes } from '../entity'
import { IUploadAttributes } from './types'

export const UploadAttributes: IUploadAttributes = {
  userId: null,
  spaceId: null,
  entityId: null,
  entity: null,
  type: null,
}

@attributes(UploadAttributes)
export class UploadValue extends EntityValue<IUploadAttributes> {
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

  static fromObject(object: IUploadAttributes): UploadValue {
    return new UploadValue(object)
  }

  static fromObjectAndUserId(object: IUploadAttributes, userId: number): UploadValue {
    return UploadValue.fromObject(Object.assign({ ...object }, { userId }))
  }
}
