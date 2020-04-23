import { LinkResource } from './resource'

export interface RootState {
  auth: AuthState;
  link: LinkState;
  error: ErrorState;
}

export interface AuthState {
  token: string | null;
  user: object | null;
  spaces: object | null;
}

export interface LinkState {
  payload: LinkResource[];
  active: LinkResource | null;
}

export interface ErrorState {
  showErrorMessage: boolean;
  errorMessage: object | null;
}
