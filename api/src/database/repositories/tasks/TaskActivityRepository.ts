import { EntityRepository } from 'typeorm'
import { TaskActivity } from '../../entities/tasks/TaskActivity'
import { BaseRepository } from '../BaseRepository'

@EntityRepository(TaskActivity)
export class TaskActivityRepository extends BaseRepository<TaskActivity> {}
