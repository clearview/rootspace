export type UserCreateAttributes = {
  firstName: string
  lastName: string
  email: string
  password: string
  password_confirmation: string
}

export type UserUpdateAttributes = Omit<Partial<UserCreateAttributes>, 'password' | 'password_confirmation' | 'email'>

export type PasswordChangeAttributes = {
  password: string
  newPassword: string
}

export type PasswordSetAttributes = {
  newPassword: string
}

export type PasswordRecoveryAttributes = {
  email: string
  urlQueryParams: string
}

export type PasswordResetAttributes = {
  token: string
  password: string
}
export type UserRoleSetAttributes = {
  roleId: number
}
