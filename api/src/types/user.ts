export interface ISignupProvider {
  firstName: string
  lastName: string
  email: string
  password?: string
  password_confirmation?: string
  authProvider: string
  active: boolean
  emailConfirmed?: boolean
}

export enum UserAuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
}
