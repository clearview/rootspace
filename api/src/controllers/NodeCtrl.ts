import { ForbiddenError } from '@casl/ability'
import { Request, Response } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { NodeUpdateValue } from '../values/node'
import { validateNodeUpdate } from '../validation/node'
import { ServiceFactory } from '../services/factory/ServiceFactory'
import { NodeService, FavoriteService } from '../services'
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
    const node = await this.nodeService.requireNodeById(Number(req.params.id))
    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Update, node)

    const data = req.body.data
    await validateNodeUpdate(data)

    let value = NodeUpdateValue.fromObject(data)

    if (data.parent !== undefined) {
      value = value.withParent(data.parent)
    }

    if (data.position !== undefined) {
      value = value.withPosition(data.position)
    }

    const result = await this.nodeService.update(value, node.id, req.user.id)
    res.send(this.responseData(result))
  }

  async archive(req: Request, res: Response) {
    const node = await this.nodeService.requireNodeById(Number(req.params.id))
    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Manage, node)

    const resutl = await this.nodeService.archive(node.id, req.user.id)
    res.send(this.responseData(resutl))
  }

  async restore(req: Request, res: Response) {
    const node = await this.nodeService.requireNodeById(Number(req.params.id), null, { withDeleted: true })
    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Manage, node)

    const result = await this.nodeService.restore(node.id, req.user.id)
    res.send(this.responseData(result))
  }

  async delete(req: Request, res: Response) {
    const node = await this.nodeService.requireNodeById(Number(req.params.id), null, { withDeleted: true })
    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Delete, node)

    const result = await this.nodeService.remove(node.id, req.user.id)
    res.send(this.responseData(result))
  }

  async addToFavorites(req: Request, res: Response) {
    const node = await this.nodeService.requireNodeById(Number(req.params.id))
    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Manage, node)

    const result = await this.favoriteService.addNode(node, req.user.id)
    res.send(this.responseData(result))
  }

  async removeFromFavorites(req: Request, res: Response) {
    const node = await this.nodeService.requireNodeById(Number(req.params.id))
    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Manage, node)

    const result = await this.favoriteService.removeNode(node, req.user.id)
    res.send(this.responseData(result))
  }
}
