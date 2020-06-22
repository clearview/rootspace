import { config } from 'node-config-ts'
import { Request, Response, NextFunction } from 'express'
import { ForbiddenError } from '@casl/ability'
import { HttpErrNames } from '../errors'
import { HttpError } from '../errors/HttpError'

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ForbiddenError) {
    return res.status(403).send({
      status: 'forbidden',
      message: err.message
    })
  }

  if (HttpErrNames.includes(err.name) && HttpErrNames.includes(err.response)) {
    const e = err as HttpError
    return res.status(e.statusCode).send(e.response())
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
