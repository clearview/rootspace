export interface ILinkCreateObject {
  userId: number
  spaceId: number
  title: string
  type: string
  value: string
  parent?: number
}

export class LinkCreateValue {
  private readonly props: ILinkCreateObject = {
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
    this.props = {
      userId,
      spaceId,
      title,
      type,
      value,
      parent,
    }
  }

  get userId(): number {
    return this.props.userId
  }

  get spaceId(): number {
    return this.props.spaceId
  }

  get title(): string {
    return this.props.title
  }

  get type(): string {
    return this.props.type
  }

  get value(): string {
    return this.props.value
  }

  get parent(): number {
    return this.props.parent
  }

  toObject(): ILinkCreateObject {
    return this.props
  }

  static fromObject(data: ILinkCreateObject) {
    return new LinkCreateValue(
      data.userId,
      data.spaceId,
      data.title,
      data.type,
      data.value,
      data.parent
    )
  }

  static fromObjectAndUserId(data: ILinkCreateObject, userId: number) {
    Object.assign(data, { userId })
    return LinkCreateValue.fromObject(data)
  }
}
