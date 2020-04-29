import {
  IDocCreateProvider,
} from '../../types/doc'
import { DocCreateValidator } from './DocCreateValidator'

export function validateDocCreate(input: IDocCreateProvider): Promise<any> {
  return new DocCreateValidator().validate(input)
}