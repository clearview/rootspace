import { Request } from 'express'
import { ResponseData } from '../response/ResponseData'
import { clientError, HttpErrName, HttpStatusCode } from '../errors'

export class BaseCtrl {
  protected checkSpaceAccess(req: Request, spaceId: number, throwError: boolean = true): boolean {
    const user = req.user as any

    if (user.userSpaceIds.includes(spaceId)) {
      return true
    }

    if (throwError) {
      throw clientError('Space not found', HttpErrName.EntityNotFound, HttpStatusCode.NotFound)
    }

    return false
  }

  protected responseData(data: object | object[] | string) {
    return new ResponseData(data)
  }
}
