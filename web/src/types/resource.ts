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
  id: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
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
  userId: number | null;
  spaceId: number | null;
  listId: number | null;
  assignedTo: never[] | null;
  title: string;
  description: string | null;
  status: TaskItemStatus;
  tags: string[] | null;
  attachments: never[] | null;
  dueDate: Date | null;
  position: number;
  list: TaskListResource | null;
}

export interface TaskListResource extends ApiResource {
  userId: number | null;
  spaceId: number | null;
  boardId: number | null;
  title: string;
  description: string | null;
  position: number;
  board: TaskBoardResource | null;
  tasks: TaskItemResource[];
}

export interface TaskBoardResource extends ApiResource {
  uuid: string | null;
  userId: number | null;
  spaceId: number | null;
  title: string;
  description: string | null;
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

export interface DocumentResource {
  spaceId: number;
  title: string;
  content: object;
  access: number;
}
