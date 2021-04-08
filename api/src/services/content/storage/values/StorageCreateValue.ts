import { EntityValue, attributes } from '../../../../root/values'
import { StorageCreateAttributes } from './types'

const attrs: StorageCreateAttributes = {
  userId: null,
  spaceId: null,
  title: null,
  parentId: null,
}

@attributes(attrs)
export class StorageCreateValue extends EntityValue<StorageCreateAttributes> {
  static fromObject(object: StorageCreateAttributes): StorageCreateValue {
    return new StorageCreateValue(object)
  }

  static fromObjectAndUserId(object: Omit<StorageCreateAttributes, 'userId'>, userId: number): StorageCreateValue {
    return StorageCreateValue.fromObject(Object.assign(object, { userId }))
  }
}
