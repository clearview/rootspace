import {
  NodeResource,
  LinkResource,
  SpaceResource,
  SpaceSettingResource,
  TaskBoardResource,
  TaskListResource,
  TaskItemResource,
  DocumentResource,
  UserResource
} from './resource'
import { TaskSettings } from '@/store/modules/task/settings'

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
  page: PageState;
}

export interface AuthState {
  token: string | null;
  user: UserResource | null;
  spaces: SpaceResource[] | null;
  currentSpace: SpaceResource | null;
}

export interface TreeState {
  list: NodeResource[];
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
  settings: TaskSettings;
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
  deferredParent: NodeResource | null;
}

export interface SpaceState {
  activeIndex: number;
  list: SpaceResource[];
  settings: SpaceSettingResource[];
}

export interface PageState {
  ready: boolean;
}
