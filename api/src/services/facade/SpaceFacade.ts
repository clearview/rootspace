import { Space } from '../../database/entities/Space'
import { UserToSpace } from '../../database/entities/UserToSpace'
import { SpaceCreateValue, SpaceUpdateValue } from '../../values/space'
import { SpaceService, UserSpaceService, NodeService, UserService } from '../'
import { ServiceFactory } from '../factory/ServiceFactory'
import { clientError, HttpErrName, HttpStatusCode } from '../../response/errors'
import { Node } from '../../database/entities/Node'

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

  getTree(spaceId: number): Promise<Node[]> {
    return this.nodeService.getTreeBySpaceId(spaceId)
  }

  getArchiveTree(spaceId: number): Promise<Node[]> {
    return this.nodeService.getArchiveTreeBySpaceId(spaceId)
  }

  deleteArchive(spaceId: number): Promise<Node[]> {
    return this.nodeService.deleteArchivedBySpaceId(spaceId)
  }

  getUserSpaces(userId: number): Promise<Space[]> {
    return this.spaceService.getSpacesByUserId(userId)
  }

  getUserFavorites(userId: number, spaceId: number): Promise<Node[]> {
    return this.nodeService.getUserFavorites(userId, spaceId)
  }

  async createSpace(data: SpaceCreateValue): Promise<Space> {
    const space = await this.spaceService.create(data)

    await this.userSpaceService.add(space.userId, space.id)

    await this.nodeService.createSpaceRootNode(space.id, space.userId)
    await this.nodeService.createSpaceArchiveNode(space.id)

    return space
  }

  updateSpace(data: SpaceUpdateValue, spaceId: number): Promise<Space> {
    return this.spaceService.update(data, spaceId)
  }

  async removeUserFromSpace(userId: number, spaceId: number): Promise<UserToSpace> {
    const user = await this.userService.requireUserById(userId)
    const space = await this.spaceService.requireSpaceById(spaceId)

    if ((await this.userSpaceService.isUserInSpace(userId, spaceId)) === false) {
      throw clientError('User not found in space', HttpErrName.EntityNotFound, HttpStatusCode.NotFound)
    }

    if (user.id === space.userId) {
      throw clientError('Can not remove space owner from space', HttpErrName.InvalidRequest, HttpStatusCode.NotAllowed)
    }

    const userSpace = this.userSpaceService.remove(userId, spaceId)

    return userSpace
  }
}
