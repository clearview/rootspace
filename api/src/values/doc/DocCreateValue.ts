import { EntityValue, attributes } from '../entity'
import { IDocCreateAttributes } from './types'

export const DocCreateAttributes: IDocCreateAttributes = {
  userId: null,
  spaceId: null,
  title: null,
  content: null,
  contentState: null,
  access: null,
  isLocked: null,
  parentId: null,
}

@attributes(DocCreateAttributes)
export class DocCreateValue extends EntityValue<IDocCreateAttributes> {
  private _nodeConfig: any = undefined

  static fromObject(data: IDocCreateAttributes) {
    return new DocCreateValue(data)
  }

  get nodeConfig(): any {
    return this._nodeConfig
  }

  withNodeConfig(config: any): DocCreateValue {
    const copy = this.copy()
    copy._nodeConfig = config

    return copy
  }

  private copy(): DocCreateValue {
    const copy = new DocCreateValue({ ...this.attributes })
    copy._nodeConfig = this._nodeConfig

    return copy
  }

  static fromObjectAndUserId(
    object: Omit<IDocCreateAttributes, 'userId'>,
    userId: number
  ) {
    return DocCreateValue.fromObject(Object.assign(object, { userId }))
  }
}
