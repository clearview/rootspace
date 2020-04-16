import { Request, Response, NextFunction } from 'express'
import { errNames, errNamesArray } from '../errors/errNames'

export function validationErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err.name === errNames.validationFailed) {
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
  if (errNamesArray.includes(err.name)) {
    return res.status(err.code).send({ error: err.name, message: err.message })
  }
  next(err)
}
