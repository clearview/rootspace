import { EmbedCreateValidator } from './EmbedCreateValidator'
import { EmbedUpdateValidator } from './EmbedUpdateValidator'

export function validateEmbedCreate(input: object): Promise<any> {
  return new EmbedCreateValidator().validate(input)
}

export function validateEmbedUpdate(input: object): Promise<any> {
  return new EmbedUpdateValidator().validate(input)
}
