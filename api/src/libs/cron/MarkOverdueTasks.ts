import { getCustomRepository, IsNull, Not } from 'typeorm'
import { TaskRepository } from '../../database/repositories/tasks/TaskRepository'
import { Task } from '../../database/entities/tasks/Task'
import moment from 'moment'

export class MarkOverdueTasks {
  static async run() {
    const tasks = await getCustomRepository(TaskRepository).find({ isOverdue: false, dueDate: Not(IsNull()) })

    for (const task of tasks) {
      task.isOverdue = MarkOverdueTasks.isOverdue(task)
    }

    await getCustomRepository(TaskRepository).save(tasks, { chunk: 1000 })
  }

  private static isOverdue(task: Task): boolean {
    if (!task.dueDate) {
      return false
    }

    const now = moment()
    const dueDate = moment(task.dueDate)

    return dueDate < now
  }
}
