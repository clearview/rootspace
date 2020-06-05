export abstract class AttributesValue<T> {
  public readonly _attributes: T

  constructor(attributes: T) {
    this._attributes = attributes
  }

  get attributes(): T {
    const filtered = this._attributes

    for (const key in this._attributes) {
      if (filtered[key] === undefined) {
        delete filtered[key]
      }
    }

    return filtered
  }
}
