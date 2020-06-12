import { Link } from '../entities/Link'
import { DocService } from './DocService'
import { DeleteResult } from 'typeorm'

export class LinkContentService {
  private static instance: LinkContentService
  private constructor() {}

  static getInstance() {
    if (!LinkContentService.instance) {
      LinkContentService.instance = new LinkContentService()
    }

    return LinkContentService.instance
  }

  private getContentHandlers = {
    doc: (link: Link) => {
      return DocService.getInstance().getLinkContent(link)
    },
  }

  private updateContentHandlers = {
    doc: (link: Link) => {
      return DocService.getInstance().updateByLink(link)
    },
  }

  private deleteContentHandlers = {
    doc: (link: Link) => {
      return DocService.getInstance().deleteByLink(link)
    },
  }

  getLinkContent(link: Link): Promise<object | object[] | null> {
    if (this.getContentHandlers.hasOwnProperty(link.type)) {
      return this.getContentHandlers[link.type]()
    }

    return null
  }

  updateByLink(link: Link): Promise<object | object[] | null> {
    if (this.updateContentHandlers.hasOwnProperty(link.type)) {
      return this.updateContentHandlers[link.type]()
    }

    return null
  }

  deleteByLink(link: Link): Promise<DeleteResult> {
    if (this.deleteContentHandlers.hasOwnProperty(link.type)) {
      return this.deleteContentHandlers[link.type]()
    }

    return null
  }
}
