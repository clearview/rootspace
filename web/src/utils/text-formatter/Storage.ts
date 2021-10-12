import { ActivityResource } from '@/types/resource'
import TextFormatter from './TextFormatter'
import { ACTIVITIES_LIST } from './utils'

export class StorageFormat extends TextFormatter {
  private text: string
  private data: ActivityResource
  private username: string

  constructor (resource: ActivityResource, userName: string, userID?: number) {
    super('storage', resource, userID)

    this.data = resource
    this.username = userName
    this.text = `<span class="actor">${this.username}</span>&nbsp;`
  }

  format (): string {
    switch (this.data.action) {
      case ACTIVITIES_LIST.Created:
        return this.text + this.created()
      case ACTIVITIES_LIST.Updated:
        return this.text + this.updated()
      case ACTIVITIES_LIST.Archived:
        return this.text + this.archived()
      case ACTIVITIES_LIST.Restored:
        return this.text + this.restored()
      case ACTIVITIES_LIST.Deleted:
        return this.text + this.deleted()
      case ACTIVITIES_LIST.UploadFile:
        this.title = this.data.context.filename

        return this.text + this.uploadFile(this.title)
      case ACTIVITIES_LIST.DeleteFile: {
        const oldName = this.data.context.filename
        const ext = oldName.split('.')[1]

        this.title = `${this.data.context.file.name}.${ext}`

        return this.text + this.deleteFile(this.title)
      }
      case ACTIVITIES_LIST.RenameFile: {
        this.title = this.data.context.fromName
        const ext = this.title.split('.')[1]

        const toName = `${this.data.context.toName}.${ext}`

        return this.text + this.renameFile(this.title, toName)
      }
      default:
        console.error('Cannot determine activities action')
        return ''
    }
  }

  protected created (): string {
    return this.create()
  }

  protected updated (): string {
    return this.update()
  }

  protected deleted (): string {
    return this.delete()
  }

  protected archived (): string {
    return this.archive()
  }

  protected restored (): string {
    return this.restore()
  }

  protected uploadFile (title: string): string {
    return `<span class="action">uploaded a file <strong>${title}</strong></span>`
  }

  protected deleteFile (title: string): string {
    return `<span class="action">deleted a file <strong>${title}</strong></span>`
  }

  protected renameFile (title: string, toName: string): string {
    return `<span class="action">renamed a file from <strong>${title}</strong> to <strong>${toName}</strong></span>`
  }
}
