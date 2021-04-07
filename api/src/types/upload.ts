export enum UploadType {
  UserAvatar = 'userAvatar',
  SpaceLogo = 'spaceLogo',
  TaskAttachment = 'taskAttachment',
  DocContent = 'docContent',
  Storage = 'storage'
}

export enum UploadEntity {
  User = 'User',
  Space = 'Space',
  Task = 'Task',
  Doc = 'Doc',
  Storage = 'Storage'
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

export interface IUploadVersion {
  location: string
  filename: string
}

export interface IUploadVersions {
  [key: string]: IUploadVersion
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
