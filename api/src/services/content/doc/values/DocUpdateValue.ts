import { EntityValue, attributes } from '../../../../root/values'
import { DocUpdateAttributes } from './types'

const attrs: DocUpdateAttributes = {
  title: undefined,
  content: undefined,
  contentState: undefined,
  access: undefined,
  isLocked: undefined,
}

@attributes(attrs)
export class DocUpdateValue extends EntityValue<DocUpdateAttributes> {
  static fromObject(data: DocUpdateAttributes) {
    return new DocUpdateValue(data)
  }
}
