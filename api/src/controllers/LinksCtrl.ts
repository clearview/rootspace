import { Request, Response, NextFunction } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { LinkType } from '../constants'
import { LinkCreateValue, LinkUpdateValue } from '../values/link'
import { validateLinkCreate, validateLinkUpdate } from '../validation/link'
import { LinkService } from '../services'
import { ContentManager } from '../services/content/ContentManager'
import { clientError, HttpErrName, HttpStatusCode } from '../errors'
import {Actions} from '../middleware/AuthorizationMiddleware'
import {ForbiddenError} from '@casl/ability'

export class LinksCtrl extends BaseCtrl {
  protected linkSrvice: LinkService
  protected contentManager: ContentManager

  constructor() {
    super()
    this.linkSrvice = LinkService.getInstance()
    this.contentManager = ContentManager.getInstance()
  }

  public async view(req: Request, res: Response, next: NextFunction) {
    try {
      const link = await this.linkSrvice.getLinkById(Number(req.params.id))
      ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Read, link)

      if (!link) {
        throw clientError(
          'Not found',
          HttpErrName.EntityNotFound,
          HttpStatusCode.NotFound
        )
      }

      const resData = this.responseData(link)

      if (link.type !== LinkType.Link) {
        const linkContent = await this.contentManager.getContentByLink(link)
        resData.includes(linkContent, link.type)
      }

      res.send(resData)
    } catch (err) {
      next(err)
    }
  }

  public async listAll(req: Request, res: Response, next: NextFunction) {
    try {
      const spaceId = Number(req.params.spaceId)

      if (!spaceId) {
        throw clientError('Error fetching links')
      }

      const links = await this.linkSrvice.getLinksBySpaceId(spaceId)
      const data = this.responseData(links)

      res.send(data)
    } catch (err) {
      next(err)
    }
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body.data
      await validateLinkCreate(data)

      let value = LinkCreateValue.fromObjectAndUserId(data, Number(req.user.id))

      if (data.parent !== undefined) {
        value = value.withParent(data.parent)
      }

      const link = await this.linkSrvice.create(value)
      const resData = this.responseData(link)

      res.send(resData)
    } catch (err) {
      next(err)
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id)
      const data = req.body.data

      await validateLinkUpdate(data)

      let value = LinkUpdateValue.fromObject(data)

      if (data.parent !== undefined) {
        value = value.withParent(data.parent)
      }

      if (data.position !== undefined) {
        value = value.withPosition(data.position)
      }

      const link = await this.linkSrvice.update(value, id)
      const resData = this.responseData(link)

      res.send(resData)
    } catch (err) {
      next(err)
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.linkSrvice.delete(Number(req.params.id))
      res.send(result)
    } catch (err) {
      next(err)
    }
  }
}
