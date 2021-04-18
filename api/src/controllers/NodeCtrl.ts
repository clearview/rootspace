import { Request, Response } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { NodeUpdateValue } from '../services/content/node/values'
import { validateNodeUpdate } from '../services/content/node'
import { ServiceFactory } from '../services/factory/ServiceFactory'
import { NodeService, FavoriteService, EntityService, ContentAccessService } from '../services'
import { hasContentPermission } from '../services/content-access'
import { ContentEntity } from '../root/types'

export class NodeCtrl extends BaseCtrl {
  private nodeService: NodeService
  private favoriteService: FavoriteService
  private entityService: EntityService
  private contentAccessService: ContentAccessService

  constructor() {
    super()
    this.nodeService = ServiceFactory.getInstance().getNodeService()
    this.favoriteService = ServiceFactory.getInstance().getFavoriteService()
    this.entityService = ServiceFactory.getInstance().getEntityService()
    this.contentAccessService = ServiceFactory.getInstance().getContentAccessService()
  }

  async update(req: Request, res: Response) {
    const node = await this.nodeService.requireNodeById(Number(req.params.id))
    const entity = await this.entityService.requireEntityByNameAndId(node.type, node.contentId)

    await hasContentPermission('update', entity, req.user.id)

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
    const entity = await this.entityService.requireEntityByNameAndId(node.type, node.contentId)

    await hasContentPermission('archive', entity, req.user.id)

    const resutl = await this.nodeService.archive(node.id, req.user.id)
    res.send(this.responseData(resutl))
  }

  async restore(req: Request, res: Response) {
    const node = await this.nodeService.requireNodeById(Number(req.params.id), null, { withDeleted: true })
    const entity = await this.entityService.requireEntityByNameAndId(node.type, node.contentId, { withDeleted: true })

    await hasContentPermission('restore', entity, req.user.id)

    const result = await this.nodeService.restore(node.id, req.user.id)
    res.send(this.responseData(result))
  }

  async delete(req: Request, res: Response) {
    const node = await this.nodeService.requireNodeById(Number(req.params.id), null, { withDeleted: true })

    const entity = await this.entityService.requireEntityByNameAndId<ContentEntity>(node.type, node.contentId, {
      withDeleted: true,
    })

    await hasContentPermission('delete', entity, req.user.id)
    await this.contentAccessService.removeForEntity(entity)

    const result = await this.nodeService.remove(node.id, req.user.id)
    res.send(this.responseData(result))
  }

  async addToFavorites(req: Request, res: Response) {
    const node = await this.nodeService.requireNodeById(Number(req.params.id))
    const entity = await this.entityService.requireEntityByNameAndId(node.type, node.contentId)

    await hasContentPermission('view', entity, req.user.id)

    const result = await this.favoriteService.addNode(node, req.user.id)
    res.send(this.responseData(result))
  }

  async removeFromFavorites(req: Request, res: Response) {
    const node = await this.nodeService.requireNodeById(Number(req.params.id))
    const result = await this.favoriteService.removeNode(node, req.user.id)

    res.send(this.responseData(result))
  }
}
