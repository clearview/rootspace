import {
  NodeResource,
  LinkResource,
  SpaceResource,
  SpaceMetaResource,
  TaskBoardResource,
  TaskListResource,
  TaskItemResource,
  DocumentResource
} from './resource'

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
  nav: SidebarState;
  sidebar: SidebarState;
  task: TaskState;
  option: OptionState;
  space: SpaceState;
  tree: TreeState;
}

export interface AuthState {
  token: string | null;
  user: object | null;
  spaces: SpaceResource[] | null;
  currentSpace: SpaceResource | null;
}

export interface TreeState {
  list: NodeResource[];
  active: string | null;
  folded: {
    [key: string]: boolean;
  };
}

export interface LinkState {
  item: LinkResource | null;
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

export interface SidebarState {
  collapse: boolean;
  size: number;
}

export interface OptionState {
  redirect: object | null;
}

export interface DocumentState {
  payload: DocumentResource[];
}

export interface SpaceState {
  activeIndex: number;
  spaces: SpaceResource[];
  spacesMeta: SpaceMetaResource[];
}
