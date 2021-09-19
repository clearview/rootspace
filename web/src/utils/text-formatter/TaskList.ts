import { ActivityResource } from '@/types/resource'
import TextFormatter from './TextFormatter'
import { sanitize, getContextListOutput, ACTIVITIES_LIST } from './utils'

export class TaskListFormat extends TextFormatter {
  private text: string
  private data: ActivityResource
  private username: string

  constructor (resource: ActivityResource, userName: string, userID?: number) {
    super('task list', resource, userID)

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
      case ACTIVITIES_LIST.ListMoved:
        return this.text + this.listMoved()
      case ACTIVITIES_LIST.AssigneeAdded:
        return this.text + this.assigneeAdded()
      case ACTIVITIES_LIST.AssigneeRemoved:
        return this.text + this.assigneeRemoved()
      case ACTIVITIES_LIST.CommentCreated:
        return this.text + this.commentCreated()
      case ACTIVITIES_LIST.TagAdded:
        return this.text + this.tagAdded()
      case ACTIVITIES_LIST.TagRemoved:
        return this.text + this.tagRemoved()
      case ACTIVITIES_LIST.AttachmentAdded:
        return this.text + this.attachmentAdded()
      case ACTIVITIES_LIST.AttachmentRemoved:
        return this.text + this.attachmentRemoved()
      default:
        console.error('Cannot determine activities action')
        return ''
    }
  }

  protected created (): string {
    return this.created()
  }

  protected updated (): string {
    let text = ''
    const updatedAttributes = this.data.context.updatedAttributes[0]

    if (updatedAttributes === 'title') {
      text += `<span class="action">renamed task list <strong>${sanitize(this.data.context.entity.title)}</strong> to <strong>${sanitize(this.data.context.updatedEntity.title)}</strong></span>`
    } else {
      text += `<span class="action">updated task list <strong>${sanitize(this.data.context.entity.title)}</strong>`
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

  protected listMoved (): string {
    return `<span class="action">moved task <strong>${sanitize(this.data.context.entity.title)}</strong> from <strong>${sanitize(this.data.context.fromList.title)}</strong> to <strong>${sanitize(this.data.context.toList.title)}</strong></span>`
  }

  protected assigneeAdded (): string {
    return `<span class="action">added ${getContextListOutput(this.data, 'assignee', 'fullName', 'strong', this.userID)} to <strong>${sanitize(this.data.context.entity.title)}</strong></span>`
  }

  protected assigneeRemoved (): string {
    return `<span class="action">removed ${getContextListOutput(this.data, 'assignee', 'fullName', 'strong', this.userID)} from <strong>${sanitize(this.data.context.entity.title)}</strong></span>`
  }

  protected commentCreated (): string {
    return `<span class="action">commented on <strong>${sanitize(this.data.context.entity.title)}</strong></span>`
  }

  protected tagAdded (): string {
    return `<span class="action">tagged <strong>${sanitize(this.data.context.entity.title)}</strong> with ${getContextListOutput(this.data, 'tag', 'label', 'strong')}</span>`
  }

  protected tagRemoved (): string {
    return `<span class="action">removed tag ${getContextListOutput(this.data, 'tag', 'label', 'strong')} from <strong>${sanitize(this.data.context.entity.title)}</strong></span>`
  }

  protected attachmentAdded (): string {
    return `<span class="action">added an attachment ${getContextListOutput(this.data, 'attachment', 'filename', 'strong')} to <strong>${sanitize(this.data.context.entity.title)}</span>`
  }

  protected attachmentRemoved (): string {
    return `<span class="action">removed an attachment ${getContextListOutput(this.data, 'attachment', 'filename', 'strong')} from <strong>${sanitize(this.data.context.entity.title)}</span>`
  }
}
