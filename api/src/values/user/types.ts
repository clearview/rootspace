export interface IUserCreateAttributes {
  firstName: string
  lastName: string
  email: string
  password: string
  passwordConfirmation: string
}

export type IUserUpdateAttributes = Omit<Partial<IUserCreateAttributes>, 'password' | 'passwordConfirmation'>

export interface IPasswordChangeAttributes {
  password: string
  newPassword: string
}

export interface IPasswordSetAttributes {
  newPassword: string
}

export interface IPasswordRecoveryAttributes {
  email: string,
  urlQueryParams: string
}

export interface IPasswordResetAttributes {
  token: string
  password: string
}
export interface IUserRoleSetAttributes {
  roleId: number
}