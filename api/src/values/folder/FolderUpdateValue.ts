import { EntityValue, attributes } from '../../root/values'
import { IFolderUpdateAttributes } from './types'

export const FolderUpdateAttributes: IFolderUpdateAttributes = {
  title: undefined,
}

@attributes(FolderUpdateAttributes)
export class FolderUpdateValue extends EntityValue<IFolderUpdateAttributes> {
  static fromObject(data: IFolderUpdateAttributes) {
    return new FolderUpdateValue(data)
  }
}
