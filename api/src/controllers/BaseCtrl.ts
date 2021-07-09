import { Request } from 'express'
import { ResponseData } from '../response/data/ResponseData'
import { clientError, HttpErrName, HttpStatusCode } from '../response/errors'
import { ResponseBody } from '../response/ResponseBody'
import { SpaceUserRole } from '../services/user-space/SpaceUserRole'

export class BaseCtrl {
  protected isSpaceMember(req: Request, spaceId: number, throwError: boolean = true): boolean {
    if (req.user.spaces.has(spaceId)) {
      return true
    }

    if (throwError) {
      throw clientError('Not found', HttpErrName.EntityNotFound, HttpStatusCode.NotFound)
    }

    return false
  }

  protected isSpaceAdmin(req: Request, spaceId: number, throwError: boolean = true) {
    if (req.user.spaces.has(spaceId) && req.user.spaces.get(spaceId) === SpaceUserRole.Admin) {
      return true
    }

    if (throwError) {
      throw clientError('You are not allowed to do this', HttpErrName.NotAllowed, HttpStatusCode.Forbidden)
    }

    return false
  }

  protected responseData(input: object | object[] | string) {
    return new ResponseData(input).getData()
  }

  protected responseBody(data: object | object[] | string) {
    return new ResponseBody(data)
  }

  protected responseError(err: Error) {
    return {
      error: {
        name: err.name,
        message: err.message,
        stack: err.stack,
      },
    }
  }
}
