import { EntityValue, attributes } from '../../root/values'
import { IFolderCreateAttributes } from './types'

export const FolderCreateAttributes: IFolderCreateAttributes = {
  userId: null,
  spaceId: null,
  title: null,
  parentId: null,
}

@attributes(FolderCreateAttributes)
export class FolderCreateValue extends EntityValue<IFolderCreateAttributes> {
  static fromObject(object: IFolderCreateAttributes): FolderCreateValue {
    return new FolderCreateValue(object)
  }

  static fromObjectAndUserId(object: Omit<IFolderCreateAttributes, 'userId'>, userId: number): FolderCreateValue {
    return FolderCreateValue.fromObject(Object.assign(object, { userId }))
  }
}
