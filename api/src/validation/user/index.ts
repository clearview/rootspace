import {
  ISignupProvider,
  IUserUpdateProvider,
  IChangePasswordProvider,
} from '../../types/user'
import { UserSignupValidator } from './UserSignupValidator'
import { UserUpdateValidator } from './UserUpdateValidator'
import { ChangePasswordValidator } from './ChangePasswordValidator'

export function validateUserSignup(input: ISignupProvider): Promise<any> {
  return new UserSignupValidator().validate(input)
}

export function validateUserUpdate(
  input: IUserUpdateProvider,
  userId: number
): Promise<any> {
  return new UserUpdateValidator(userId).validate(input)
}

export function validateChangePassword(
  input: IChangePasswordProvider
): Promise<any> {
  return new ChangePasswordValidator().validate(input)
}
