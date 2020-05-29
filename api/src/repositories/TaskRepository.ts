import { EntityRepository, Repository } from 'typeorm'
import { Task } from '../entities/Task'

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {}
