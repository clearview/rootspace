import { EntityRepository } from 'typeorm'
import { TaskList } from '../../database/entities/tasks/TaskList'
import { BaseRepository } from '../BaseRepository'

@EntityRepository(TaskList)
export class TaskListRepository extends BaseRepository<TaskList> {}
