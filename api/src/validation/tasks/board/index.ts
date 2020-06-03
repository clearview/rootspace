import { TaskBoardCreateValidator } from './TaskBoardCreateValidator'
import { TaskBoardUpdateValidator } from './TaskBoardUpdateValidator'

export function validateTaskBoardCreate(input: object): Promise<any> {
  return new TaskBoardCreateValidator().validate(input)
}

export function validateTaskBoardUpdate(input: object): Promise<any> {
  return new TaskBoardUpdateValidator().validate(input)
}
