import { getCustomRepository, LessThan } from 'typeorm'
import { TaskRepository } from '../../database/repositories/tasks/TaskRepository'
import { Task } from '../../database/entities/tasks/Task'
import moment from 'moment'

export class MarkOverdueTasks {
  static async run() {
    const yesterday = moment().subtract(1, 'days')
    const tasks = await getCustomRepository(TaskRepository).find(
      {
        isOverdue: false,
        dueDate: LessThan(yesterday)
      }
    )

    for (const task of tasks) {
      task.isOverdue = MarkOverdueTasks.isOverdue(task)
    }

    await getCustomRepository(TaskRepository).save(tasks, { chunk: 1000 })
  }

  private static isOverdue(task: Task): boolean {
    const now = moment()
    const dueDate = moment(task.dueDate)

    return dueDate < now
  }
}
