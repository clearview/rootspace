import { ILinkCreateAttributes } from './types'

export class LinkCreateValue {
  private readonly attributes: ILinkCreateAttributes = {
    userId: null,
    spaceId: null,
    title: null,
    type: null,
    value: null,
  }

  private _parent: number = null

  constructor(
    userId: number,
    spaceId: number,
    title: string,
    type: string,
    value: string
  ) {
    this.attributes = {
      userId,
      spaceId,
      title,
      type,
      value,
    }
  }

  get userId(): number {
    return this.attributes.userId
  }

  get spaceId(): number {
    return this.attributes.spaceId
  }

  get title(): string {
    return this.attributes.title
  }

  get type(): string {
    return this.attributes.type
  }

  get value(): string {
    return this.attributes.value
  }

  get parent(): number {
    return this._parent
  }

  set parent(value: number) {
    this._parent = value
  }

  getAttributes(filiterUndefined: boolean = true): ILinkCreateAttributes {
    if (filiterUndefined === false) {
      return this.attributes
    }

    const filtered = this.attributes

    for (const key in this.attributes) {
      if (filtered[key] === undefined) {
        delete filtered[key]
      }
    }

    return filtered
  }

  static fromObject(data: ILinkCreateAttributes): LinkCreateValue {
    return new LinkCreateValue(
      data.userId,
      data.spaceId,
      data.title,
      data.type,
      data.value
    )
  }

  static fromObjectAndUserId(
    data: ILinkCreateAttributes,
    userId: number
  ): LinkCreateValue {
    Object.assign(data, { userId })
    return LinkCreateValue.fromObject(data)
  }
}
