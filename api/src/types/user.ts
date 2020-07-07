export interface ISignupProvider {
  firstName: string
  lastName: string
  email: string
  password: string
  password_confirmation: string
}

export interface IChangePasswordProvider {
  password: string
  newPassword: string
  newPassword_confirmation: string
}
