import { ISignupProvider } from '../../types/user'
import { UserSignupValidator } from './UserSignupValidator'
import { UserUpdateValidator } from './UserUpdateValidator'
import { ChangePasswordValidator } from './ChangePasswordValidator'
import { PasswordRecoveryValidator } from './PasswordRecoveryValidator'
import { PasswordResetValidator } from './PasswordResetValidator'

export function validateUserSignup(input: ISignupProvider): Promise<any> {
  return new UserSignupValidator().validate(input)
}

export function validateUserUpdate(
  input: object,
  userId: number
): Promise<any> {
  return new UserUpdateValidator(userId).validate(input)
}

export function validateChangePassword(input: object): Promise<any> {
  return new ChangePasswordValidator().validate(input)
}

export function validatePasswordRecovery(input: object): Promise<any> {
  return new PasswordRecoveryValidator().validate(input)
}

export function validatePasswordReset(input: object): Promise<any> {
  return new PasswordResetValidator().validate(input)
}
