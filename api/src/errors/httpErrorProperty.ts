export enum ClientErrName {
  InvalidRequest = 'invalidRequest',
  ValidationFailed = 'validationFailed',
  EntityCreateFailed = 'entityCreateFailed',
  EntityUpdateFailed = 'entityUpdateFailed',
  EntityNotFound = 'entityNotFound',
  AuthenticationFailed = 'authenticationFailed',
  UserNotConfirmed = 'userNotConfirmed',
  WrongPassword = 'wrongPassword',
  InvalidToken = 'invalidToken',
}

export const ClientErrNameArray: string[] = Object.keys(ClientErrName).map(
  (key) => ClientErrName[key]
)

export enum ClientStatusCode {
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
}
