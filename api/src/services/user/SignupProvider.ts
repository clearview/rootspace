export type SignupProvider = {
  firstName: string
  lastName: string
  email: string
  password?: string
  password_confirmation?: string
  authProvider: string
  active: boolean
  emailConfirmed?: boolean
}