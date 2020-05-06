import { Link } from '../../entities/Link'

export interface ILinkContent<T> {
  getData(link: Link): Promise<T | T[]>
}

export abstract class LinkContent<T> implements ILinkContent<T> {
  abstract getData(link: Link): Promise<T | T[]>
}
