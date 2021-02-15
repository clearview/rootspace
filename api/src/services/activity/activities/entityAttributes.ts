export function entityAttributes(attrs: object) {
  return <T extends new (...args: any[]) => {}>(constructor: T) => {
    return class extends constructor {
      _entityAttributes = attrs
    }
  }
}

export function entityUpdateAttributes(attrs: object) {
  return <T extends new (...args: any[]) => {}>(constructor: T) => {
    return class extends constructor {
      _entityUpdateAttributes = attrs
    }
  }
}
