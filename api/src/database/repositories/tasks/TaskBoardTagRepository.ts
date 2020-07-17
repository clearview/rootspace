import { EntityRepository } from 'typeorm'
import { BaseRepository } from '../BaseRepository'
import { Tag } from '../../entities/tasks/Tag'

@EntityRepository(Tag)
export class TaskBoardTagRepository extends BaseRepository<Tag> {}
