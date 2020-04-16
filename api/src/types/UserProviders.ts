export interface ISignupProvider {
  name: string
  email: string
  password: string
  confirm_password: string
}

export interface ILoginProvider {
  email: string
  password: string
}
