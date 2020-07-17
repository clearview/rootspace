import { Space } from '../../database/entities/Space'
import { SpaceCreateValue, SpaceUpdateValue } from '../../values/space'
import { NodeCreateValue } from '../../values/node'
import { NodeType } from '../../types/node'
import { SpaceService, UserSpaceService, NodeService } from '../'

export class SpaceFacade {
  private spaceService: SpaceService
  private userSpaceService: UserSpaceService
  private nodeService: NodeService

  constructor() {
    this.spaceService = SpaceService.getInstance()
    this.userSpaceService = UserSpaceService.getInstance()
    this.nodeService = NodeService.getInstance()
  }

  getNodesTree(spaceId: number) {
    return this.nodeService.getTreeBySpaceId(spaceId)
  }

  getUserSpaces(userId: number): Promise<Space[]> {
    return this.spaceService.getSpacesByUserId(userId)
  }

  async createSpace(data: SpaceCreateValue): Promise<Space> {
    const space = await this.spaceService.create(data)
    await this.userSpaceService.add(space.userId, space.id)

    await this.nodeService.createRootNode(
      NodeCreateValue.fromObject({
        userId: space.userId,
        spaceId: space.id,
        contentId: space.id,
        title: 'root',
        type: NodeType.Root,
      })
    )

    return space
  }

  updateSpace(data: SpaceUpdateValue, spaceId: number): Promise<Space> {
    return this.spaceService.update(data, spaceId)
  }
}
