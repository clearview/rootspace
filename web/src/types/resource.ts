export interface NodeResource {
  id: number;
  spaceId: number;
  parentId: number;
  userId: number;
  contentId: number;
  title: string;
  type: string;
  config: object | null;
  position: number;
  created: string;
  updated: string;
  children: NodeResource[];
}

export interface LinkResource {
  id: number;
  spaceId: number;
  title: string;
  type: string;
  value: string;
  children?: LinkResource[];
  newTab: boolean;
}

/**
 * @deprecated
 */
export interface UploadResource {
  createdAt: Date;
  id: number;
  size: 386397;
  path: string;
  spaceId: number;
  type: string;
  updated: Date;
  userId: number;
}
export interface UploadKeyPath {
  path: string;
  key: string;
}
export interface NewUploadResource {
  createdAt: Date;
  entity: 'Task';
  entityId: number;
  id: number;
  mimetype: string;
  path: string;
  size: number;
  spaceId: number;
  type: 'taskAttachment' | 'userAvatar' | 'spaceLogo';
  updatedAt: Date;
  userId: number;
  versions: {
    thumbnail?: UploadKeyPath;
    preview?: UploadKeyPath;
    default?: UploadKeyPath;
  };
  index?: number;
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

export interface TagResource extends Omit<ApiResource, 'createdAt' | 'updatedAt'> {
  board: TaskBoardResource | null;
  label: string;
  color: string;
}

export interface TaskItemResource extends ApiResource {
  userId: number | null;
  spaceId: number | null;
  listId: number | null;
  assignees: UserResource[] | null;
  title: string;
  description: string | null;
  slug: string | null;
  status: TaskItemStatus;
  tags: TagResource[] | null;
  attachments: NewUploadResource[] | null;
  dueDate: Date | null;
  position: number;
  list: TaskListResource | null;
  taskComments: TaskCommentResource[];
}

export interface TaskCommentResource extends ApiResource{
  userId: number | null;
  user: UserResource | null;
  taskId: number | null;
  content: string;
  task: TaskItemResource | null;
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
  settings: Record<string, any>;
}

export interface TaskBoardResource extends ApiResource {
  uuid: string | null;
  userId: number | null;
  spaceId: number;
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

export interface PasswordResource {
  password: string;
  newPassword: string;
  newPassword_confirmation: string; // eslint-disable-line
}

export interface SpaceResource {
  id: number;
  title: string;
  invites: string[];
  settings?: object;
}

export interface SpaceMetaResource {
  activePage?: string;
}

export interface UserResource {
  id: number;
  active?: boolean;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: NewUploadResource;
  authProvider?: string;
  emailConfirmed?: boolean;
  token?: string;
  created?: string;
  updated?: string;
}

export interface DocumentResource {
  id: number;
  spaceId: number;
  title: string;
  content: object;
  access: number;
}

export interface ActivityResource {
  action: string;
  actor: UserResource;
  actorId: number;
  createdAt: string;
  entity: string;
  entityId: number;
  id: number;
  spaceId: number;
  tableName: string;
}
export interface TaskActivityResource extends ActivityResource{
  Task: TaskItemResource;
}

export interface UserSettingResource {
  sidebar: {
    collapse: boolean;
    size: number;
  };
  space: {
    activeIndex: number;
    spacesMeta: SpaceMetaResource[];
  };
  task: {
    viewAs: Record<number, TaskBoardType>;
    seenViewTip: boolean;
  };
  tree: {
    folded: object;
  };
}
