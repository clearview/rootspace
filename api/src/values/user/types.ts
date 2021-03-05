export interface IUserCreateAttributes {
  firstName: string
  lastName: string
  email: string
  password: string
  password_confirmation: string
}

export type IUserUpdateAttributes = Omit<Partial<IUserCreateAttributes>, 'password' | 'password_confirmation'>

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
