import { ISignupProvider, IChangePasswordProvider } from '../../types/user'
import { UserSignupValidator } from './UserSignupValidator'
import { UserUpdateValidator } from './UserUpdateValidator'
import { UserUpdateValue } from '../../values/user'
import { ChangePasswordValidator } from './ChangePasswordValidator'
import { PasswordRecovery } from './PasswordRecovery'

export function validateUserSignup(input: ISignupProvider): Promise<any> {
  return new UserSignupValidator().validate(input)
}

export function validateUserUpdate(
  input: UserUpdateValue,
  userId: number
): Promise<any> {
  return new UserUpdateValidator(userId).validate(input)
}

export function validateChangePassword(
  input: IChangePasswordProvider
): Promise<any> {
  return new ChangePasswordValidator().validate(input)
}

export function validatePasswordRecovery(
  input: IChangePasswordProvider
): Promise<any> {
  return new PasswordRecovery().validate(input)
}
