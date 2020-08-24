import { UploadValidator } from './UploadValidator'

export function validateUpload(data: object): Promise<any> {
  return new UploadValidator().validate(data)
}
