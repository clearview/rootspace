import { EntityValue, attributes } from '../../root/values'
import { IStorageUpdateAttributes } from './types'

export const StorageUpdateAttributes: IStorageUpdateAttributes = {
  title: undefined,
}

@attributes(StorageUpdateAttributes)
export class StorageUpdateValue extends EntityValue<IStorageUpdateAttributes> {
  static fromObject(data: IStorageUpdateAttributes) {
    return new StorageUpdateValue(data)
  }
}
