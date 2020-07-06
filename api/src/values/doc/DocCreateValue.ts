import { EntityValue, attributes } from '../entity'
import { IDocCreateAttributes } from './types'
import { DocAccess } from '../../constants'

export const DocCreateAttributes: IDocCreateAttributes = {
  userId: null,
  spaceId: null,
  title: null,
  content: null,
  access: DocAccess.All,
  isLocked: false,
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
