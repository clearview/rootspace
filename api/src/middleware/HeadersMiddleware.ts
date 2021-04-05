import { Request, Response, NextFunction } from 'express'

export function removeHeaders(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.removeHeader('x-powered-by')
  next()
}
