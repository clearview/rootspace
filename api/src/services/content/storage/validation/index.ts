import { StorageCreateValidator } from './StorageCreateValidator'
import { StorageUpdateValidator } from './StorageUpdateValidator'

export function validateStorageCreate(input: object): Promise<any> {
  return new StorageCreateValidator().validate(input)
}

export function validateStorageUpdate(input: object): Promise<any> {
  return new StorageUpdateValidator().validate(input)
}
