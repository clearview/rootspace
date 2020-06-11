import { EntityRepository, Repository } from 'typeorm'
import {TaskBoard} from '../entities/tasks/TaskBoard'

@EntityRepository(TaskBoard)
export class TaskBoardRepository extends Repository<TaskBoard> {}
