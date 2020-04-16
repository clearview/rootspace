export interface RootState {
  auth: AuthState
}

export interface AuthState {
  token: string | null;
  user: object | null;
  spaces: object | null;
}
