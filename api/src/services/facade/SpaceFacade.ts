import { Space } from '../../database/entities/Space'
import { UserToSpace } from '../../database/entities/UserToSpace'
import { SpaceCreateValue, SpaceUpdateValue } from '../../values/space'
import { NodeCreateValue } from '../../values/node'
import { NodeType } from '../../types/node'
import { SpaceService, UserSpaceService, NodeService, UserService } from '../'
import { ServiceFactory } from '../factory/ServiceFactory'
import { clientError, HttpErrName, HttpStatusCode } from '../../errors'

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

  getNodesTree(spaceId: number) {
    return this.nodeService.getTreeBySpaceId(spaceId)
  }

  getArchive(spaceId: number) {
    return this.nodeService.getArchiveBySpaceId(spaceId)
  }

  getUserSpaces(userId: number): Promise<Space[]> {
    return this.spaceService.getSpacesByUserId(userId)
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

    if (user.id === space.userId) {
      throw clientError('Can not remove space owner from space', HttpErrName.InvalidRequest, HttpStatusCode.NotAllowed)
    }

    return this.userSpaceService.remove(userId, spaceId)
  }
}
