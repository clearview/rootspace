export interface IUserCreateAttributes {
  firstName: string
  lastName: string
  email: string
  password: string
  password_confirmation: string
}

export type IUserUpdateAttributes = Omit<
  Partial<IUserCreateAttributes>,
  'password' | 'password_confirmation'
>
