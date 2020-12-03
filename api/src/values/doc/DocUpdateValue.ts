import { EntityValue, attributes } from '../entity'
import { IDocUpdateAttributes } from './types'

export const DocUpdateAttributes: IDocUpdateAttributes = {
  title: undefined,
  content: undefined,
  contentState: undefined,
  access: undefined,
  isLocked: undefined,
}

@attributes(DocUpdateAttributes)
export class DocUpdateValue extends EntityValue<IDocUpdateAttributes> {
  static fromObject(data: IDocUpdateAttributes) {
    return new DocUpdateValue(data)
  }
}
