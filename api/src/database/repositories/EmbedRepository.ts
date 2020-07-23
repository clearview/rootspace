import { EntityRepository, Repository } from 'typeorm'
import { Embed } from '../entities/Embed'

@EntityRepository(Embed)
export class EmbedRepository extends Repository<Embed> {}
