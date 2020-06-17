import { EntityValue, attributes } from '../entity'
import { IDocUpdateAttributes } from './types'

export const DocUpdateAttributes = {
  title: undefined,
  content: undefined,
  access: undefined,
}

@attributes(DocUpdateAttributes)
export class DocUpdateValue extends EntityValue<IDocUpdateAttributes> {
  static fromObject(data: IDocUpdateAttributes) {
    return new DocUpdateValue(data)
  }
}
