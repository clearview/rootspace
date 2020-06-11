import { OutputData } from '@editorjs/editorjs/types/data-formats/output-data'

export interface LinkResource {
  id: number;
  spaceId: number;
  title: string;
  type: string;
  value: string;
  children?: LinkResource[];
  config?: {
    alwaysOpen: boolean;
  };
}

export interface ApiResource {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum TaskItemStatus {
  Open = 0,
  Closed = 1
}

export enum TaskBoardType {
  List = 1,
  Kanban = 2
}

export interface TaskItemResource extends ApiResource {
  userId?: number;
  spaceId?: number;
  listId?: number;
  assignedTo?: never[];
  title: string;
  description?: string;
  status: TaskItemStatus;
  tags?: string[];
  attachments?: never[];
  dueDate?: Date;
  position: number;
  list?: TaskListResource;
}

export interface TaskListResource extends ApiResource {
  userId?: number;
  spaceId?: number;
  boardId?: number;
  title: string;
  description?: string;
  position: number;
  board?: TaskBoardResource;
  tasks: TaskItemResource[];
}

export interface TaskBoardResource extends ApiResource {
  uuid?: string;
  userId?: number;
  spaceId: number;
  title: string;
  description?: string;
  type: TaskBoardType;
  taskLists: TaskListResource[];
  isPublic: boolean;
}

export interface SignupResource {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  password_confirmation: string; // eslint-disable-line
}

export interface SigninResource {
  email: string;
  password: string;
}

export interface SettingsResource {
  firstName: string;
  lastName: string;
  email: string;
}

export interface PasswordResource {
  password: string;
  newPassword: string;
  newPassword_confirmation: string; // eslint-disable-line
}

export interface WorkspaceResource {
  id: number;
  title: string;
  invites: string[];
  settings?: object;
}

export interface UserResource {
  active: boolean;
  authProvider: string;
  email: string;
  emailConfirmed: boolean;
  firstName: string;
  id: number;
  lastName: string;
  token: string;
  created: string;
  updated: string;
}

export interface Editor {
  documentChanged: boolean;
  editor: any; // eslint-disable-line
}

export interface RootEditor {
  savedData: OutputData;
  onChange: Function;
}

export interface DocumentResource {
  spaceId: number;
  title: string;
  content: object;
  access: number;
}

// export interface DocumentData {
//   time?: number;
//   blocks?: Array<OutputData>;
//   version: string;
// }
