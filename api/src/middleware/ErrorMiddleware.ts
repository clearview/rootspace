import { Request, Response, NextFunction } from 'express'
import { clientError, clientErrorArray } from '../errors/httpErrors'

export function httpValidationErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err.name === clientError.validationFailed) {
    return res.status(err.statusCode).send({
      error: {
        name: err.name,
        message: err.message,
      },
    })
  }

  next(err)
}

export function httpClientErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (clientErrorArray.includes(err.name)) {
    return res.status(err.statusCode).send({
      error: {
        name: err.name,
        message: err.message,
      },
    })
  }

  next(err)
}

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  next(err)
}
