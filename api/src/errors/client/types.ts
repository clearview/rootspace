export enum ClientErrName {
  InvalidRequest = 'invalidRequest',
  ValidationFailed = 'validationFailed',
  EntityCreateFailed = 'entityCreateFailed',
  EntityUpdateFailed = 'entityUpdateFailed',
  EntityDeleteFailed = 'entityDeleteFailed',
  EntityNotFound = 'entityNotFound',
  AuthenticationFailed = 'authenticationFailed',
  EmailNotConfirmed = 'userNotConfirmed',
  UserNotActive = 'userNotActive',
  WrongPassword = 'wrongPassword',
  InvalidToken = 'invalidToken',
}

export const ClientErrNames: string[] = Object.keys(ClientErrName).map(
  (key) => ClientErrName[key]
)

export enum ClientStatusCode {
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  NotAllowed = 405,
}
