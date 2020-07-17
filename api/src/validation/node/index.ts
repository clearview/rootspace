import { NodeUpdateValidator } from './NodeUpdateValidator'

export function validateNodeUpdate(input: object): Promise<any> {
  return new NodeUpdateValidator().validate(input)
}
