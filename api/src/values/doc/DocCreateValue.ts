import { EntityValue, attributes } from '../entity'
import { IDocCreateAttributes } from './types'

export const DocCreateAttributes: IDocCreateAttributes = {
  userId: null,
  spaceId: null,
  title: null,
  content: null,
  access: null,
  isLocked: null,
}

@attributes(DocCreateAttributes)
export class DocCreateValue extends EntityValue<IDocCreateAttributes> {
  static fromObject(data: IDocCreateAttributes) {
    return new DocCreateValue(data)
  }

  static fromObjectAndUserId(
    object: Omit<IDocCreateAttributes, 'userId'>,
    userId: number
  ) {
    return DocCreateValue.fromObject(Object.assign(object, { userId }))
  }
}
