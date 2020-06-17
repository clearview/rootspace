import { LinkResource, WorkspaceResource, TaskBoardResource, TaskListResource, TaskItemResource } from './resource'

export interface ResourceState<T>{
  processing: boolean;
  fetching: boolean;
  data: T[];
  current: T | null;
}
export interface CollectionResourceState<T>{
  processing: boolean;
  fetching: boolean;
  data: Record<number, T>;
  current: T | null;
}

export interface RootState {
  auth: AuthState;
  link: LinkState;
  nav: NavState;
  task: TaskState;
  option: OptionState;
}

export interface AuthState {
  token: string | null;
  user: object | null;
  spaces: WorkspaceResource[] | null;
  currentSpace: WorkspaceResource | null;
}

export interface LinkState {
  payload: LinkResource[];
  active: string | null;
  folded: {
    [key: string]: boolean;
  };
}

export interface TaskState {
  board: TaskBoardState;
  list: TaskListState;
  item: TaskItemState;
}

export interface TaskBoardState {
  data: TaskBoardResource[];
  current: TaskBoardResource | null;
}

export interface TaskListState {
  data: TaskListResource[];
  current: TaskListResource | null;
}

export interface TaskItemState {
  data: TaskItemResource[];
  current: TaskItemResource | null;
}

export interface NavState {
  collapse: boolean;
  size: number;
}

export interface OptionState {
  redirect: object | null;
}
