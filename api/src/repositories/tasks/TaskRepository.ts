import { EntityRepository } from 'typeorm'
import { Task } from '../../database/entities/tasks/Task'
import { BaseRepository } from '../BaseRepository'

@EntityRepository(Task)
export class TaskRepository extends BaseRepository<Task> {}
