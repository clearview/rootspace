import { Request, Response } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { NodeUpdateValue } from '../values/node'
import { validateNodeUpdate } from '../validation/node'
import { ServiceFactory } from '../services/factory/ServiceFactory'
import { NodeService, FavoriteService } from '../services'
import { ForbiddenError } from '@casl/ability'
import { Actions } from '../middleware/AuthMiddleware'

export class NodeCtrl extends BaseCtrl {
  private nodeService: NodeService
  private favoriteService: FavoriteService

  constructor() {
    super()
    this.nodeService = ServiceFactory.getInstance().getNodeService()
    this.favoriteService = ServiceFactory.getInstance().getFavoriteService()
  }

  async update(req: Request, res: Response) {
    const id = Number(req.params.id)
    const data = req.body.data

    await validateNodeUpdate(data)
    let value = NodeUpdateValue.fromObject(data)

    if (data.parent !== undefined) {
      value = value.withParent(data.parent)
    }

    if (data.position !== undefined) {
      value = value.withPosition(data.position)
    }

    const node = await this.nodeService.update(value, id)
    const resData = this.responseData(node)

    res.send(resData)
  }

  async archive(req: Request, res: Response) {
    const resutl = await this.nodeService.archive(Number(req.params.id))
    res.send(this.responseData(resutl))
  }

  async restore(req: Request, res: Response) {
    const resutl = await this.nodeService.restore(Number(req.params.id))
    res.send(this.responseData(resutl))
  }

  async delete(req: Request, res: Response) {
    const result = await this.nodeService.remove(Number(req.params.id))
    res.send(result)
  }

  async addToFavorites(req: Request, res: Response) {
    const node = await this.nodeService.requireNodeById(Number(req.params.id))
    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Manage, node)

    const result = await this.favoriteService.createByNode(node, req.user.id)
    res.send(this.responseData(result))
  }

  async removeFromFavorites(req: Request, res: Response) {
    const id = Number(req.params.id)
    const userId = req.user.id

    const favorite = await this.favoriteService.requireByNodeIdAndUserId(id, userId)
    const result = await this.favoriteService.removeEntity(favorite)

    res.send(this.responseData(result))
  }
}
