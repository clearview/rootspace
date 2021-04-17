import { EntityValue, attributes } from '../../../../root/values'
import { DocCreateAttributes } from './types'

const attrs: DocCreateAttributes = {
  userId: null,
  spaceId: null,
  title: null,
  content: null,
  contentState: null,
  access: null,
  isLocked: null,
  parentId: null,
}

@attributes(attrs)
export class DocCreateValue extends EntityValue<DocCreateAttributes> {
  private _nodeConfig: any = undefined

  static fromObject(data: DocCreateAttributes) {
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

  static fromObjectAndUserId(object: Omit<DocCreateAttributes, 'userId'>, userId: number) {
    return DocCreateValue.fromObject(Object.assign(object, { userId }))
  }
}
