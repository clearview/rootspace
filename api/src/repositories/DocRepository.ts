import { EntityRepository, Repository } from 'typeorm'
import { Doc } from '../database/entities/Doc'

@EntityRepository(Doc)
export class DocRepository extends Repository<Doc> {}
