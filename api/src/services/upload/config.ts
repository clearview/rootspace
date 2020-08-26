import { UploadType, IUploadImageConfig } from '../../types/upload'

export const UploadUniqueTypes = [UploadType.UserAvatar, UploadType.SpaceLogo]

export const UploadImageConfig: IUploadImageConfig[] = [
  {
    type: UploadType.UserAvatar,
    sizes: [
      {
        name: 'small',
        width: 28,
        height: 28,
      },
      {
        name: 'medium',
        width: 96,
        height: 96,
      },
    ],
  },
  {
    type: UploadType.SpaceLogo,
    sizes: [
      {
        name: 'small',
        width: 32,
        height: 32,
      },
      {
        name: 'medium',
        width: 64,
        height: 64,
      },
    ],
  },
  {
    type: UploadType.TaskAttachment,
    sizes: [
      {
        name: 'small',
        width: 80,
        height: 64,
      },
      {
        name: 'preview',
        width: 1024,
        height: null,
      },
    ],
  },
]
