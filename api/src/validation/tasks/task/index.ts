import { TaskCreateValidator } from './TaskCreateValidator'
import { TaskUpdateValidator } from './TaskUpdateValidator'

export function validateTaskCreate(input: object): Promise<any> {
  return new TaskCreateValidator().validate(input)
}

export function validateTaskUpdate(input: object): Promise<any> {
  return new TaskUpdateValidator().validate(input)
}
