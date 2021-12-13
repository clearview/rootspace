import {
  NodeResource,
  LinkResource,
  SpaceResource,
  SpaceSettingResource,
  TaskBoardResource,
  TaskListResource,
  TaskItemResource,
  DocumentResource,
  StorageResource,
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
  storage: StorageState;
  option: OptionState;
  space: SpaceState;
  tree: TreeState;
  page: PageState;
}

export interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: UserResource | null;
  spaces: SpaceResource[] | null;
  currentSpace: SpaceResource | null;
}

export interface TreeState {
  focusedList: NodeResource[];
  list: NodeResource[];
  favorites: NodeResource[];
  folded: {
    [key: string]: boolean;
  };
  touched: Record<string, boolean>;
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
export interface StorageState {
  info: StorageResource | null;
  item: StorageResource | null;
  processing: boolean;
  totalData: number;
  viewAs: number;
}
export interface SpaceState {
  activeIndex: number;
  list: SpaceResource[];
  settings: SpaceSettingResource[];
  freezeSettings: boolean;
  afterFrozen: boolean;
}

export interface PageState {
  ready: boolean;
}
