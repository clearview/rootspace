import { config } from 'node-config-ts'
import { Request, Response, NextFunction } from 'express'
import { ClientErrName, ClientErrNames } from '../errors/client'

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err.name === ClientErrName.ValidationFailed) {
    return res.status(err.statusCode).send(err.response())
  }

  if (ClientErrNames.includes(err.name)) {
    return res.status(err.statusCode).send(err.response())
  }

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
