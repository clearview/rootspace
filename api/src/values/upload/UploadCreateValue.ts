import { EntityValue, attributes } from '../entity'
import { IUploadAttributes } from './types'

export const SpaceCreateAttributes = {
  userId: null,
  spaceId: null,
  entity: null,
  entityId: null,
  contentType: null,
}

@attributes(SpaceCreateAttributes)
export class UploadCreateValue extends EntityValue<IUploadAttributes> {
  private _file: any = undefined

  get file(): any {
    return this._file
  }

  withFile(file: any): UploadCreateValue {
    const copy = this.copy()
    copy._file = file
    return copy
  }

  private copy(): UploadCreateValue {
    const copy = new UploadCreateValue({ ...this.attributes })
    copy._file = this._file

    return copy
  }

  static fromObject(object: IUploadAttributes): UploadCreateValue {
    return new UploadCreateValue(object)
  }

  static fromObjectAndUserId(object: IUploadAttributes, userId: number): UploadCreateValue {
    Object.assign(object, { userId })
    return UploadCreateValue.fromObject(Object.assign(object, { userId }))
  }
}
