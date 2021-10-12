import { ActivityResource } from '@/types/resource'
import TextFormatter from './TextFormatter'
import { sanitize, ACTIVITIES_LIST } from './utils'

export class DocFormat extends TextFormatter {
  private text: string
  private data: ActivityResource
  private username: string

  constructor (resource: ActivityResource, userName: string, userID?: number) {
    super('document', resource, userID)

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
      case ACTIVITIES_LIST.Open:
      case ACTIVITIES_LIST.Restricted:
        return this.text + this.openOrRestricted()
      case ACTIVITIES_LIST.Public:
      case ACTIVITIES_LIST.Private:
        return this.text + this.publicOrPrivate()
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
      const updatedTitle = this.data.context.updatedEntity.title
      const title = updatedTitle.trim().length === 0 ? 'Untitled' : updatedTitle

      text += `<span class="action">set document title to <strong>${sanitize(title)}</strong></span>`
    } else if (updatedAttributes === 'content') {
      text += `<span class="action">updated the content of document <strong>${sanitize(this.data.context.entity.title)}</strong></span>`
    } else {
      text += `<span class="action">updated document <strong>${sanitize(this.data.context.entity.title)}</strong></span>`
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

  protected openOrRestricted (): string {
    const type = this.data.context.access.type

    return `<span class="action">change ${this.action} <strong>${sanitize(this.title)}</strong> access to <strong>${type}</strong></span>`
  }

  protected publicOrPrivate () {
    const type = this.data.context.access.public ? 'public' : 'private'
    return `<span class="action">change ${this.action} <strong>${sanitize(this.title)}</strong> access to <strong>${type}</strong></span>`
  }
}
