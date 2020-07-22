import { FolderCreateValidator } from './FolderCreateValidator'
import { FolderUpdateValidator } from './FolderUpdateValidator'

export function validateFolderCreate(input: object): Promise<any> {
  return new FolderCreateValidator().validate(input)
}

export function validateFolderUpdate(input: object): Promise<any> {
  return new FolderUpdateValidator().validate(input)
}
