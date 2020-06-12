import { Link } from '../entities/Link'
import { DeleteResult } from 'typeorm'

export interface ILinkContent<T> {
  getLinkContent(link: Link): Promise<T>
  updateByLink(link: Link): Promise<T>
  deleteByLink(link: Link): Promise<DeleteResult>
}
