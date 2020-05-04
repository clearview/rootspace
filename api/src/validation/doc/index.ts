import { IDocCreateProvider, IDocUpdateProvider } from '../../types/doc'
import { DocCreateValidator } from './DocCreateValidator'
import { DocUpdateValidator } from './DocUpdateValidator'

export function validateDocCreate(input: IDocCreateProvider): Promise<any> {
  return new DocCreateValidator().validate(input)
}

export function validateDocUpdate(input: IDocUpdateProvider): Promise<any> {
  return new DocUpdateValidator().validate(input)
}
