import { UploadType } from './UploadType'

export type UploadImageSize = {
  name: string
  width: number
  height?: number
}

export type UploadImageConfigType = {
  type: string
  sizes: UploadImageSize[]
}

export type UploadVersion = {
  location: string
  filename: string
}

export type UploadVersions = {
  [key: string]: UploadVersion
}
