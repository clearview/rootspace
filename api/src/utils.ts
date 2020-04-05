export function mapRoute(ctrl: any, fn: string) {
  let instances = {}
  if (instances[ctrl] instanceof ctrl == false) {
    instances[ctrl] = new ctrl()
  }
  return instances[ctrl][fn].bind(instances[ctrl])
}
