import {
    EntitySubscriberInterface,
    InsertEvent,
    EventSubscriber,
    getCustomRepository,
} from 'typeorm'
import { Task } from '../Task'
import { TaskRepository } from '../../repositories/TaskRepository'

@EventSubscriber()
export class TaskSubscriber implements EntitySubscriberInterface<Task> {
    listenTo() {
        return Task
    }

    async beforeInsert(event: InsertEvent<Task>) {
        const task = event.entity

        let position = await getCustomRepository(
            TaskRepository
        ).getMaxPositionByListId(task.listId)

        task.position = ++position
    }
}
