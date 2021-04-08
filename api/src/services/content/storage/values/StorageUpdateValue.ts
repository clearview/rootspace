import { EntityValue, attributes } from '../../../../root/values'
import { StorageUpdateAttributes } from './types'

const attrs: StorageUpdateAttributes = {
  title: undefined,
}

@attributes(attrs)
export class StorageUpdateValue extends EntityValue<StorageUpdateAttributes> {
  static fromObject(data: StorageUpdateAttributes) {
    return new StorageUpdateValue(data)
  }
}
