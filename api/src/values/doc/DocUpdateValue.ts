import { AttributesValue } from '../AttributesValue'
import { attributes } from '../attributes'
import { IDocUpdateAttributes } from './types'

export const DocUpdateAttributes = {
  title: undefined,
  content: undefined,
  access: undefined,
}

@attributes(DocUpdateAttributes)
export class DocUpdateValue extends AttributesValue<IDocUpdateAttributes> {
  static fromObject(data: IDocUpdateAttributes) {
    return new DocUpdateValue(data)
  }
}
