import { EntityValue, attributes } from '../../../../root/values'
import { FolderCreateAttributes } from './types'

const attrs: FolderCreateAttributes = {
  userId: null,
  spaceId: null,
  title: null,
  parentId: null,
}

@attributes(attrs)
export class FolderCreateValue extends EntityValue<FolderCreateAttributes> {
  static fromObject(object: FolderCreateAttributes): FolderCreateValue {
    return new FolderCreateValue(object)
  }

  static fromObjectAndUserId(object: Omit<FolderCreateAttributes, 'userId'>, userId: number): FolderCreateValue {
    return FolderCreateValue.fromObject(Object.assign(object, { userId }))
  }
}
