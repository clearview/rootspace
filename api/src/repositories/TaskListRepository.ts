import { EntityRepository, Repository } from 'typeorm'
import { TaskList } from '../entities/TaskList'

@EntityRepository(TaskList)
export class TaskListRepository extends Repository<TaskList> {

    async getMaxPositionByBoardId(boardId: string): Promise<number> {
        return this.createQueryBuilder('taskList')
            .where('taskList.boardId = :boardId', { boardId })
            .getCount()
    }

}
