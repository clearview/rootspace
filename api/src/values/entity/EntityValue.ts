export abstract class EntityValue<T> {
  protected readonly _attributes: T

  constructor(attributes: T) {
    for (const key in attributes) {
      if (this._attributes.hasOwnProperty(key)) {
        this._attributes[key] = attributes[key]
      }
    }
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
