import { ILinkCreateAttributes } from './types'

export class LinkCreateValue {
  private readonly attributes: ILinkCreateAttributes = {
    userId: null,
    spaceId: null,
    title: null,
    type: null,
    value: null,
    parent: null,
  }

  constructor(
    userId: number,
    spaceId: number,
    title: string,
    type: string,
    value: string,
    parent: number = null
  ) {
    this.attributes = {
      userId,
      spaceId,
      title,
      type,
      value,
      parent,
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
    return this.attributes.parent
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
      data.value,
      data.parent
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
