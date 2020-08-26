export enum UploadType {
  UserAvatar = 'userAvatar',
  SpaceLogo = 'spaceLogo',
  TaskAttachment = 'taskAttachment',
}

export interface IUploadImageSize {
  name: string
  width: number
  height?: number
}

export interface IUploadImageConfig {
  type: UploadType
  sizes: IUploadImageSize[]
}
