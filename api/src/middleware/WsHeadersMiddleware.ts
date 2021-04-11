import { Request, Response } from 'express'

export function removeWsHeaders() {
  return (req: Request, res: Response) => {
    res.removeHeader('Server')
  }
}
