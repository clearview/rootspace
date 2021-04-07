export enum HttpErrName {
  InvalidRequest = 'invalidRequest',
  ValidationFailed = 'validationFailed',
  EntityCreateFailed = 'entityCreateFailed',
  EntityUpdateFailed = 'entityUpdateFailed',
  EntityDeleteFailed = 'entityDeleteFailed',
  EntityNotFound = 'entityNotFound',
  Unauthorized = 'unauthorized',
  Forbidden = 'forbidden',
  NotAllowed = 'notAllowed',
  InvalidToken = 'invalidToken',
}

export const HttpErrNames: string[] = Object.keys(HttpErrName).map(
  (key) => HttpErrName[key]
)

export enum HttpStatusCode {
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  NotAllowed = 405,
}
