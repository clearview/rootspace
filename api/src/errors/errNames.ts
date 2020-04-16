interface ErrNamesProvider {
  responseError: string
  internalError: string
  validationFailed: string
  entityCreateFailed: string
  entityUpdateFailed: string
  entityNotFound: string
  authenticationFailed: string
  userNotConfirmed: string
  wrongPassword: string
}

export const errNames: ErrNamesProvider = {
  responseError: 'responseError',
  internalError: 'internalError',
  validationFailed: 'validationFailed',
  entityCreateFailed: 'entityCreateFailed',
  entityUpdateFailed: 'entityUpdateFailed',
  entityNotFound: 'entityNotFound',
  authenticationFailed: 'authenticationFailed',
  userNotConfirmed: 'userNotConfirmed',
  wrongPassword: 'wrongPassword'
}

export const errNamesArray: string[] = Object.keys(errNames)
