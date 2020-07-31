import { Request, Response } from 'express'
import auth from 'basic-auth'
import { config } from 'node-config-ts'

const admin = config.arena

export default async (req: Request, res: Response, next: any): Promise<Response> => {
  const user = auth(req)
  if (!user || admin.username !== user.name || admin.password !== user.pass) {
    res.set('WWW-Authenticate', 'Basic realm="Root Arena"')
    return res.status(401).send()
  }

  return next()
}
