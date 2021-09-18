import { ActivityResource } from '@/types/resource'
import { sanitize } from './utils'

export default abstract class TextFormatter {
  protected title: string
  protected action: string
  protected userID?: number

  constructor (action: string, resource: ActivityResource, userID?: number) {
    this.action = action
    this.title = resource.context.entity.title.replace(/(^\s+|\s+$)/g, '') || 'Untitled'
    this.userID = userID
  }

  protected create (): string {
    let text = `<span class="action">created a new ${this.action}`

    if (this.title) {
      text += `<strong>${sanitize(this.title)}</strong>`
    }

    text += '</span>'

    return text
  }

  protected delete (): string {
    return `<span class="action">deleted ${this.action} <strong>${this.title}</strong></span>`
  }

  protected archive (): string {
    return `<span class="action">archived ${this.action} <strong>${this.title}</strong></span>`
  }

  protected restore (): string {
    return `<span class="action">restored ${this.action} <strong>${this.title}</strong></span>`
  }

  protected update (): string {
    return `<span class="action">updated ${this.action} <strong>${sanitize(this.title)}</strong></span>`
  }

  abstract format(): string
}
