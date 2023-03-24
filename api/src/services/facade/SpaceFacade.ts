import { Space } from '../../database/entities/Space'
import { UserToSpace } from '../../database/entities/UserToSpace'
import { Node } from '../../database/entities/Node'
import { SpaceCreateValue, SpaceUpdateValue } from '../space'
import { SpaceService, UserSpaceService, NodeService, UserService } from '../'
import { ServiceFactory } from '../factory/ServiceFactory'
import { clientError, HttpErrName, HttpStatusCode } from '../../response/errors'
import { SpaceUserRole, SpaceUserUpdateValue } from '../user-space'

export class SpaceFacade {
  private spaceService: SpaceService
  private userService: UserService
  private userSpaceService: UserSpaceService
  private nodeService: NodeService

  constructor() {
    this.spaceService = ServiceFactory.getInstance().getSpaceService()
    this.userService = ServiceFactory.getInstance().getUserService()
    this.userSpaceService = ServiceFactory.getInstance().getUserSpaceService()
    this.nodeService = ServiceFactory.getInstance().getNodeService()
  }

  async getTree(spaceId: number, userId: number): Promise<Node[]> {
    const spaceUser = await this.userSpaceService.requireByUserIdAndSpaceId(userId, spaceId, { active: true })
    return this.nodeService.getSpaceTree(spaceId, spaceUser)
  }

  async getArchiveTree(spaceId: number, userId: number): Promise<Node[]> {
    const spaceUser = await this.userSpaceService.requireByUserIdAndSpaceId(userId, spaceId, { active: true })
    return this.nodeService.getSpaceArchiveTree(spaceId, spaceUser)
  }

  async deleteArchive(spaceId: number, actorId: number): Promise<Node[]> {
    const spaceUser = await this.userSpaceService.requireByUserIdAndSpaceId(actorId, spaceId, { active: true })
    return this.nodeService.deleteArchivedBySpaceId(spaceId, spaceUser)
  }

  getUserSpaces(userId: number): Promise<Space[]> {
    return this.spaceService.getSpacesByUserId(userId)
  }

  getUserFavorites(userId: number, spaceId: number): Promise<Node[]> {
    return this.nodeService.getUserFavorites(userId, spaceId)
  }

  async createSpace(data: SpaceCreateValue): Promise<Space> {
    const space = await this.spaceService.create(data)

    await this.userSpaceService.add(space.userId, space.id, SpaceUserRole.Admin)

    await this.nodeService.createSpaceRootNode(space.id, space.userId)
    await this.nodeService.createSpaceArchiveNode(space.id)

    return space
  }

  updateSpace(data: SpaceUpdateValue, spaceId: number): Promise<Space> {
    return this.spaceService.update(data, spaceId)
  }

  async updateSpaceUser(data: SpaceUserUpdateValue, userId: number, spaceId: number): Promise<UserToSpace> {
    const user = await this.userService.requireUserById(userId)
    const space = await this.spaceService.requireSpaceById(spaceId)

    if ((await this.userSpaceService.isUserInSpace(userId, spaceId)) === false) {
      throw clientError('User not found in space', HttpErrName.EntityNotFound, HttpStatusCode.NotFound)
    }

    if (user.id === space.userId) {
      throw clientError('Can not update space owner role', HttpErrName.NotAllowed, HttpStatusCode.Forbidden)
    }

    const result = await this.userSpaceService.update(data, userId, spaceId)
    return result
  }

  async removeSpaceUser(userId: number, spaceId: number): Promise<UserToSpace> {
    const user = await this.userService.requireUserById(userId)
    const space = await this.spaceService.requireSpaceById(spaceId)

    if ((await this.userSpaceService.isUserInSpace(userId, spaceId)) === false) {
      throw clientError('User not found in space', HttpErrName.EntityNotFound, HttpStatusCode.NotFound)
    }

    if (user.id === space.userId) {
      throw clientError('Can not remove space owner from space', HttpErrName.InvalidRequest, HttpStatusCode.Forbidden)
    }

    const userSpace = await this.userSpaceService.remove(userId, spaceId)
    return userSpace
  }
}
