import { ISignupProvider } from '../../../types/user'
import { UserSignupValidator } from './UserSignupValidator'
import { UserUpdateValidator } from './UserUpdateValidator'
import { PasswordChangeValidator } from './PasswordChangeValidator'
import { PasswordRecoveryValidator } from './PasswordRecoveryValidator'
import { PasswordResetValidator } from './PasswordResetValidator'
import { PasswordSetValidator } from './PasswordSetValidator'

export function validateUserSignup(input: ISignupProvider): Promise<any> {
  return new UserSignupValidator().validate(input)
}

export function validateUserUpdate(input: object, userId: number): Promise<any> {
  return new UserUpdateValidator(userId).validate(input)
}

export function validatePasswordChange(input: object): Promise<any> {
  return new PasswordChangeValidator().validate(input)
}

export function validatePasswordSet(input: object): Promise<any> {
  return new PasswordSetValidator().validate(input)
}

export function validatePasswordRecovery(input: object): Promise<any> {
  return new PasswordRecoveryValidator().validate(input)
}

export function validatePasswordReset(input: object): Promise<any> {
  return new PasswordResetValidator().validate(input)
}
