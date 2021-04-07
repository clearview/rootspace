export function attributes(attrs: object) {
  return <T extends new (...args: any[]) => {}>(constructor: T) => {
    return class extends constructor {
      constructor(...args: any[]) {
        const data = args[0] as object
        const filtered = {}

        for (const key in data) {
          if (attrs.hasOwnProperty(key)) {
            filtered[key] = data[key]
          }
        }

        args[0] = filtered
        super(...args)
      }
    }
  }
}
