import { ILinkUpdateAttributes } from './types'

export class LinkUpdateValue {
  private readonly attributes: ILinkUpdateAttributes = {
    title: undefined,
    value: undefined,
  }

  private _parent: number

  private constructor(title?: string, value?: string, parent?: number) {
    this.attributes = {
      title,
      value,
    }
  }

  get title(): string {
    return this.attributes.title
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

  getAttributes(filiterUndefined: boolean = true): ILinkUpdateAttributes {
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

  static fromObject(data: ILinkUpdateAttributes) {
    return new LinkUpdateValue(data.title, data.value)
  }
}
