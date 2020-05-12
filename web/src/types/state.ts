import { LinkResource } from './resource'

export interface RootState {
  auth: AuthState;
  link: LinkState;
  nav: NavState;
}

export interface AuthState {
  token: string | null;
  user: object | null;
  spaces: object[] | null;
  currentSpace: SpaceState | null;
}

export interface LinkState {
  payload: LinkResource[];
  active: LinkResource | null;
  folded: {
    [key: string]: boolean;
  };
}

export interface NavState {
  collapse: boolean;
  size: number;
}

export interface SpaceState {
  id: number;
  settings: null;
  title: string;
}
