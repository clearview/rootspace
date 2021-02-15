export function push() {
  return <T extends new (...args: any[]) => {}>(constructor: T) => {
    return class extends constructor {
      _push = true
    }
  }
}

export function persist() {
  return <T extends new (...args: any[]) => {}>(constructor: T) => {
    return class extends constructor {
      _persist = true
    }
  }
}

export function handler(handler: string) {
  return <T extends new (...args: any[]) => {}>(constructor: T) => {
    return class extends constructor {
      _handler = handler
    }
  }
}
