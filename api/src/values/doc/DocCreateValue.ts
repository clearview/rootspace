import {IDocCreateAttributes} from './types'

export class DocCreateValue {
  private readonly attributes: IDocCreateAttributes = {
    userId: null,
    spaceId: null,
    title: null,
    content: null,
    access: null,
  }

  private constructor(
    userId: number,
    spaceId: number,
    title: string,
    content: object,
    access: number
  ) {
    this.attributes = {
      userId,
      spaceId,
      title,
      content,
      access,
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

  get content(): object {
    return this.attributes.content
  }

  get access(): number {
    return this.attributes.access
  }

  getAttributes(filiterUndefined: boolean = true): IDocCreateAttributes {
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

  static fromObject(data: IDocCreateAttributes) {
    return new DocCreateValue(
      data.userId,
      data.spaceId,
      data.title,
      data.content,
      data.access
    )
  }

  static fromObjectAndUserId(object: IDocCreateAttributes, userId: number) {
    Object.assign(object, { userId })
    return DocCreateValue.fromObject(object)
  }
}
