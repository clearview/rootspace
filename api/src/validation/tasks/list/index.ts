import { TaskListCreateValidator } from './TaskListCreateValidator'
import { TaskListUpdateValidator } from './TaskListUpdateValidator'

export function validateTaskListCreate(input: object): Promise<any> {
  return new TaskListCreateValidator().validate(input)
}

export function validateTaskListUpdate(input: object): Promise<any> {
  return new TaskListUpdateValidator().validate(input)
}
