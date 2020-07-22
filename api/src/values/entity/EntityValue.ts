export abstract class EntityValue<T> {
  private readonly _attributes: T

  constructor(attributes: T) {
    this._attributes = attributes
  }

  get attributes(): T {
    return this._attributes
  }
}
