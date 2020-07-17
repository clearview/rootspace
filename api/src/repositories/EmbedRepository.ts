import { EntityRepository, Repository } from 'typeorm'
import { Embed } from '../database/entities/Embed'

@EntityRepository(Embed)
export class EmbedRepository extends Repository<Embed> {}
