import { LinkResource, WorkspaceResource } from './resource'

export interface RootState {
  auth: AuthState;
  link: LinkState;
  nav: NavState;
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

export interface NavState {
  collapse: boolean;
  size: number;
}
