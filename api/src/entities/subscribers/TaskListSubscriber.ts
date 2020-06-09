import {
    EntitySubscriberInterface,
    InsertEvent,
    EventSubscriber,
    getCustomRepository,
} from 'typeorm'
import { TaskList } from '../TaskList'
import { TaskListRepository } from '../../repositories/TaskListRepository'

@EventSubscriber()
export class TaskListSubscriber implements EntitySubscriberInterface<TaskList> {
    listenTo() {
        return TaskList
    }

    async beforeInsert(event: InsertEvent<TaskList>) {
        const taskList = event.entity

        let position = await getCustomRepository(
            TaskListRepository
        ).getMaxPositionByBoardId(taskList.boardId)

        taskList.position = ++position
    }
}
