import { config } from 'node-config-ts'
import { Request, Response, NextFunction } from 'express'
import { ClientErrName, ClientErrNameArray } from '../errors/httpErrorProperty'

export function httpValidationErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err.name === ClientErrName.ValidationFailed) {
    return res.status(err.statusCode).send({
      error: {
        name: err.name,
        message: err.message,
        fields: err.fields,
        stack: config.env === 'dev' ? err.stack.split('\n') : null,
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
  if (ClientErrNameArray.includes(err.name)) {
    return res.status(err.statusCode).send({
      error: {
        name: err.name,
        message: err.message,
        stack: config.env === 'dev' ? err.stack.split('\n') : null,
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
  if (err instanceof Error) {
    return res.status(500).send({
      error: {
        name: err.name,
        message: err.message,
        stack: config.env === 'dev' ? err.stack.split('\n') : null,
      },
    })
  }
  next(err)
}
