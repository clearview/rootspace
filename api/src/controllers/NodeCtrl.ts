import { Request, Response } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { NodeUpdateValue } from '../services/content/node/values'
import { validateNodeUpdate } from '../services/content/node'
import { ServiceFactory } from '../services/factory/ServiceFactory'
import { NodeService, FavoriteService } from '../services'
import { hasNodePermission } from '../services/content-access'

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

    this.nodeService.verifyUpdate(node)
    await hasNodePermission('update', node, req.user.id)

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

    this.nodeService.verifyArchive(node)
    await hasNodePermission('archive', node, req.user.id)

    const resutl = await this.nodeService.archive(node.id, req.user.id)
    res.send(this.responseData(resutl))
  }

  async restore(req: Request, res: Response) {
    const node = await this.nodeService.requireNodeById(Number(req.params.id), null, { withDeleted: true })

    this.nodeService.verifyRestore(node)
    await hasNodePermission('restore', node, req.user.id)

    const result = await this.nodeService.restore(node.id, req.user.id)
    res.send(this.responseData(result))
  }

  async delete(req: Request, res: Response) {
    const node = await this.nodeService.requireNodeById(Number(req.params.id), null, { withDeleted: true })

    this.nodeService.verifyRemove(node)
    await hasNodePermission('delete', node, req.user.id)

    const result = await this.nodeService.remove(node.id, req.user.id)
    res.send(this.responseData(result))
  }

  async addToFavorites(req: Request, res: Response) {
    const node = await this.nodeService.requireNodeById(Number(req.params.id))
    await hasNodePermission('view', node, req.user.id)

    const result = await this.favoriteService.addNode(node, req.user.id)
    res.send(this.responseData(result))
  }

  async removeFromFavorites(req: Request, res: Response) {
    const node = await this.nodeService.requireNodeById(Number(req.params.id))
    const result = await this.favoriteService.removeNode(node, req.user.id)

    res.send(this.responseData(result))
  }
}
