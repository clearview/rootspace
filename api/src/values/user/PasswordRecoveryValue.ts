import { EntityValue, attributes } from '../entity'
import { IPasswordRecoveryAttributes } from './types'

export const PasswordRecoveryAttributes: IPasswordRecoveryAttributes = {
  email: null,
  urlQueryParams: null,
}

@attributes(PasswordRecoveryAttributes)
export class PasswordRecoveryValue extends EntityValue<
  IPasswordRecoveryAttributes
> {
  static fromObject(data: IPasswordRecoveryAttributes) {
    return new PasswordRecoveryValue(data)
  }
}
