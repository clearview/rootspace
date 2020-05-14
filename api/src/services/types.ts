import { UpdateResult, DeleteResult } from 'typeorm'
import { Link } from '../entities/Link'

export interface ILinkContent<T> {
  getLinkByContent(content: T): Promise<Link>
  createLinkByContent(content: T): Promise<Link>
  updateLinkByContent(content: T): Promise<UpdateResult>
  deleteLinkByContent(content: T): Promise<DeleteResult>
  getContentByLink(link: Link): Promise<T | T[]>
  updateContentByLink(link: Link): Promise<UpdateResult>
  deleteContentByLink(link: Link): Promise<DeleteResult>
}
