export function attributes(attrs: object) {
  return <T extends new (...args: any[]) => {}>(constructor: T) => {
    constructor.prototype._attributes = attrs
  }
}
