import { DocCreateValidator } from './DocCreateValidator'
import { DocUpdateValidator } from './DocUpdateValidator'

export function validateDocCreate(input: object): Promise<any> {
  return new DocCreateValidator().validate(input)
}

export function validateDocUpdate(input: object): Promise<any> {
  return new DocUpdateValidator().validate(input)
}
