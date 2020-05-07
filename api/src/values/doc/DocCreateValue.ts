import {IDocCreateObject} from './types'

export class DocCreateValue {
  private readonly props: IDocCreateObject = {
    userId: null,
    spaceId: null,
    title: null,
    content: null,
    access: null,
  }

  constructor(
    userId: number,
    spaceId: number,
    title: string,
    content: string,
    access: number
  ) {
    this.props = {
      userId,
      spaceId,
      title,
      content,
      access,
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

  get content(): string {
    return this.props.content
  }

  get access(): number {
    return this.props.access
  }

  toObject(): IDocCreateObject {
    return this.props
  }

  static fromObject(data: IDocCreateObject) {
    return new DocCreateValue(
      data.userId,
      data.spaceId,
      data.title,
      data.content,
      data.access
    )
  }

  static fromObjectAndUserId(object: IDocCreateObject, userId: number) {
    Object.assign(object, { userId })
    return DocCreateValue.fromObject(object)
  }
}
