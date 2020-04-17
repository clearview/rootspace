interface IClientError {
  invalidRequest: string
  validationFailed: string
  entityCreateFailed: string
  entityUpdateFailed: string
  entityNotFound: string
  authenticationFailed: string
  userNotConfirmed: string
  wrongPassword: string
  invalidToken: string
}

export const clientError: IClientError = {
  invalidRequest: 'invalidRequest',
  validationFailed: 'validationFailed',
  entityCreateFailed: 'entityCreateFailed',
  entityUpdateFailed: 'entityUpdateFailed',
  entityNotFound: 'entityNotFound',
  authenticationFailed: 'authenticationFailed',
  userNotConfirmed: 'userNotConfirmed',
  wrongPassword: 'wrongPassword',
  invalidToken: 'invalidToken'
}

export const clientErrorArray: string[] = Object.keys(clientError)
