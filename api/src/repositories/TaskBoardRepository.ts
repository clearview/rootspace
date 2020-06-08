import { EntityRepository, Repository } from 'typeorm'
import {TaskBoard} from '../entities/TaskBoard'

@EntityRepository(TaskBoard)
export class TaskBoardRepository extends Repository<TaskBoard> {}
