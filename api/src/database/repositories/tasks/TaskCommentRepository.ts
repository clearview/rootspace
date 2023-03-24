import { EntityRepository } from 'typeorm'
import { TaskComment } from '../../entities/tasks/TaskComment'
import { BaseRepository } from '../BaseRepository'

@EntityRepository(TaskComment)
export class TaskCommentRepository extends BaseRepository<TaskComment> {}
