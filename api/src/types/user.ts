export interface ISignupProvider {
  firstName: string
  lastName: string
  email: string
  password?: string
  passwordConfirmation?: string
  authProvider: string
  active: boolean
  emailConfirmed?: boolean
}

export enum UserAuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
}
