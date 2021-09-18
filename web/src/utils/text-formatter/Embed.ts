import { ActivityResource } from '@/types/resource'
import TextFormatter from './TextFormatter'
import { sanitize, ACTIVITIES_LIST } from './utils'

export class EmbedFormat extends TextFormatter {
  private text: string
  private data: ActivityResource
  private username: string

  constructor (resource: ActivityResource, userName: string, userID?: number) {
    super('embed', resource, userID)

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
      default:
        console.error('Cannot determine activities action')
        return ''
    }
  }

  protected created (): string {
    return this.create()
  }

  protected updated (): string {
    let text = ''
    const updatedAttributes = this.data.context.updatedAttributes[0]

    if (updatedAttributes === 'title') {
      text += `<span class="action">renamed embed <strong>${sanitize(this.data.context.entity.title)}</strong> to <strong>${sanitize(this.data.context.updatedEntity.title)}</strong></span>`
    } else {
      text += `<span class="action">updated embed <strong>${sanitize(this.data.context.entity.title)}</strong>`
    }

    return text
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
}
