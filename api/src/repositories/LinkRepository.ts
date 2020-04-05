import {EntityRepository, Repository} from 'typeorm'
import {Link} from '../entities/Link'

@EntityRepository(Link)
export class LinkRepository extends Repository<Link> {

}