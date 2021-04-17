import { EntityValue, attributes } from '../../../../root/values'
import { FolderUpdateAttributes } from './types'

export const attrs: FolderUpdateAttributes = {
  title: undefined,
}

@attributes(attrs)
export class FolderUpdateValue extends EntityValue<FolderUpdateAttributes> {
  static fromObject(data: FolderUpdateAttributes) {
    return new FolderUpdateValue(data)
  }
}
