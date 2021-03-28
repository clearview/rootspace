export abstract class EntityValue<T> {
  private readonly _attributes: T

  constructor(attributes: T) {
    this._attributes = attributes
  }

  get attributes(): T {
    const attrs = { ...this._attributes } as T

    for (const key in attrs) {
      if (!attrs.hasOwnProperty(key)) {
        continue
      }

      let value = attrs[key] as unknown

      if (typeof value === 'string') {
        value = value.trim()
      }

      attrs[key] = value as T[typeof key]
    }

    return attrs
  }
}
