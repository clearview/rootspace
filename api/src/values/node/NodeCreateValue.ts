import { EntityValue, attributes } from '../entity'
import { INodeCreateAttributes } from './types'

export const LinkCreateAttributes: INodeCreateAttributes = {
  userId: null,
  spaceId: null,
  contentId: null,
  title: null,
  type: null,
}

@attributes(LinkCreateAttributes)
export class NodeCreateValue extends EntityValue<INodeCreateAttributes> {
  static fromObject(object: INodeCreateAttributes): NodeCreateValue {
    return new NodeCreateValue(object)
  }

  static fromObjectAndUserId(
    object: Omit<INodeCreateAttributes, 'userId'>,
    userId: number
  ): NodeCreateValue {
    return NodeCreateValue.fromObject(Object.assign(object, { userId }))
  }
}
