import { Request, Response, NextFunction } from 'express'
import { HttpError } from '../errors/HttpError'
import { ValidationError } from '../errors/ValidationError'

export function validationErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err.name === ValidationError.ErrorName) {
    return res
      .status(err.code)
      .send({ message: err.message, errorBag: err.errorBag })
  }
  next(err)
}

export function httpErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err.name === HttpError.ErrorName) {
    return res.status(err.code).send({ message: err.message })
  }
  next(err)
}
