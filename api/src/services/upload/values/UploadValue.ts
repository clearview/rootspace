import { EntityValue, attributes } from '../../../root/values'
import { UploadAttributes } from './types'

const attrs: UploadAttributes = {
  userId: null,
  spaceId: null,
  entityId: null,
  entity: null,
  type: null,
  name: null,
}

@attributes(attrs)
export class UploadValue extends EntityValue<UploadAttributes> {
  private _file: any = undefined

  get file(): Express.Multer.File {
    return this._file
  }

  withFile(file: any) {
    const copy = this.copy()
    copy._file = file

    return copy
  }

  private copy() {
    const copy = new UploadValue({ ...this.attributes })
    copy._file = this._file

    return copy
  }

  static fromObject(object: UploadAttributes) {
    return new UploadValue(object)
  }

  static fromObjectAndUserId(object: UploadAttributes, userId: number) {
    return UploadValue.fromObject(Object.assign({ ...object }, { userId }))
  }
}
