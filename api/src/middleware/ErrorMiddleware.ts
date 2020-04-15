import { Request, Response, NextFunction } from 'express'
import { ErrorNames, ErrorNamesArray } from '../errors/ErrorNames'

export function validationErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err.name === ErrorNames.validationError) {
    return res
      .status(err.code)
      .send({ error: err.name, message: err.message, errorBag: err.errorBag })
  }
  next(err)
}

export function responseErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (ErrorNamesArray.includes(err.name)) {
    return res.status(err.code).send({ error: err.name, message: err.message })
  }
  next(err)
}
