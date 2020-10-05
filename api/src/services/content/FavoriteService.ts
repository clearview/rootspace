import { getCustomRepository } from 'typeorm'
import { FavoriteRepository } from '../../database/repositories/FavoriteRepository'
import { Favorite } from '../../database/entities/Favorite'
import { Node } from '../../database/entities/Node'
import { clientError, HttpErrName, HttpStatusCode } from '../../errors'
import { NodeType } from '../../types/node'

export class FavoriteService {
  private static instance: FavoriteService

  static getInstance() {
    if (!FavoriteService.instance) {
      FavoriteService.instance = new FavoriteService()
    }

    return FavoriteService.instance
  }

  getFavoriteRepository(): FavoriteRepository {
    return getCustomRepository(FavoriteRepository)
  }

  getById(id: number): Promise<Favorite | undefined> {
    return this.getFavoriteRepository().findOne(id)
  }

  async requireById(id: number): Promise<Favorite> {
    const favorite = this.getById(id)

    if (!favorite) {
      this.throwNotFound()
    }

    return favorite
  }

  async requireByNodeIdAndUserId(nodeId: number, userId: number): Promise<Favorite> {
    const favorite = await this.getByNodeIdAndUserId(nodeId, userId)

    if (!favorite) {
      this.throwNotFound()
    }

    return favorite
  }

  getByNodeIdAndUserId(nodeId: number, userId: number): Promise<Favorite | undefined> {
    return this.getFavoriteRepository().getByNodeIdAndUserId(nodeId, userId)
  }

  async createByNode(node: Node, userId: number): Promise<Favorite> {
    this.validateNode(node)

    let favorite = await this.getByNodeIdAndUserId(node.id, userId)

    if (favorite) {
      return favorite
    }

    favorite = new Favorite()
    favorite.userId = userId
    favorite.spaceId = node.spaceId
    favorite.nodeId = node.id

    return this.getFavoriteRepository().save(favorite)
  }

  removeEntity(favorite: Favorite): Promise<Favorite> {
    return this.getFavoriteRepository().remove(favorite)
  }

  private validateNode(node: Node) {
    if (node.type === NodeType.Root || node.type === NodeType.Archive) {
      throw clientError('Invalid request', HttpErrName.InvalidRequest, HttpStatusCode.BadRequest)
    }
  }

  private throwNotFound() {
    throw clientError('Entity favorite not found', HttpErrName.EntityNotFound, HttpStatusCode.NotFound)
  }
}
