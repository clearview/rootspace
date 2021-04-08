import { EntityValue, attributes } from '../../root/values'
import { IStorageCreateAttributes } from './types'

export const StorageCreateAttributes: IStorageCreateAttributes = {
  userId: null,
  spaceId: null,
  title: null,
  parentId: null,
}

@attributes(StorageCreateAttributes)
export class StorageCreateValue extends EntityValue<IStorageCreateAttributes> {
  static fromObject(object: IStorageCreateAttributes): StorageCreateValue {
    return new StorageCreateValue(object)
  }

  static fromObjectAndUserId(object: Omit<IStorageCreateAttributes, 'userId'>, userId: number): StorageCreateValue {
    return StorageCreateValue.fromObject(Object.assign(object, { userId }))
  }
}
