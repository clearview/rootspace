import { config } from 'node-config-ts'
import { Request, Response, NextFunction } from 'express'
import { HttpErrNames } from '../errors'
import { HttpError } from '../errors/HttpError'

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (HttpErrNames.includes(err.name)) {
    const e = err as HttpError
    return res.status(e.statusCode).send(e.response())
  }

  if (err instanceof Error) {
    return res.status(500).send({
      error: {
        name: err.name,
        message: err.message,
        stack: config.env !== 'production' ? err.stack.split('\n') : null,
      },
    })
  }

  next(err)
}
