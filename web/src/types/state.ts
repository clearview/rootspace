import { LinkResource, WorkspaceResource, TaskResource } from './resource'

export interface RootState {
  auth: AuthState;
  link: LinkState;
  nav: NavState;
  task: TaskState;
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
  payload: TaskResource[];
  current: TaskResource | null;
  active: string | null;
  folded: {
    [key: string]: boolean;
  };
}

export interface NavState {
  collapse: boolean;
  size: number;
}
