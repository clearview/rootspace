import { EntityRepository } from 'typeorm'
import { BaseRepository } from '../BaseRepository'
import { Tag } from '../../database/entities/tasks/Tag'

@EntityRepository(Tag)
export class TaskBoardTagRepository extends BaseRepository<Tag> {}
