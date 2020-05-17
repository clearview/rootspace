import { IDocUpdateAttributes } from './types'

export class DocUpdateValue {
  private readonly attributes: IDocUpdateAttributes = {
    title: undefined,
    content: undefined,
    access: undefined,
  }

  private constructor(title?: string, content?: string, access?: number) {
    this.attributes = {
      title,
      content,
      access,
    }
  }

  get title(): string {
    return this.attributes.title
  }

  get content(): string {
    return this.attributes.content
  }

  get access(): number {
    return this.attributes.access
  }

  getAttributes(filiterUndefined: boolean = true): IDocUpdateAttributes {
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

  static fromObject(data: IDocUpdateAttributes) {
    return new DocUpdateValue(data.title, data.content, data.access)
  }
}
