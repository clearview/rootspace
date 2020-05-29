import { Space } from '../../entities/Space'
import { SpaceCreateValue, SpaceUpdateValue } from '../../values/space'
import { LinkType } from '../../constants'
import { LinkCreateValue } from '../../values/link'
import { SpaceService } from '../SpaceService'
import { UserSpaceService } from '../UserSpaceService'
import { LinkService } from '../LinkService'

export class SpaceFacade {
  spaceService: SpaceService
  userSpaceService: UserSpaceService
  linkService: LinkService

  constructor() {
    this.spaceService = SpaceService.getInstance()
    this.userSpaceService = UserSpaceService.getInstance()
    this.linkService = LinkService.getInstance()
  }

  getUserSpaces(userId: number): Promise<Space[]> {
    return this.spaceService.getSpacesByUserId(userId)
  }

  async createSpace(data: SpaceCreateValue): Promise<Space> {
    const space = await this.spaceService.create(data)

    await this.userSpaceService.add(space.userId, space.id)

    this.linkService.createSpaceRoot(
      LinkCreateValue.fromObject({
        userId: space.userId,
        spaceId: space.id,
        title: 'root',
        type: LinkType.Root,
        value: String(space.id),
      })
    )

    return space
  }

  updateSpace(data: SpaceUpdateValue, spaceId: number): Promise<Space> {
    return this.spaceService.update(data, spaceId)
  }

  async updateSpaceMembersCount(spaceId: number): Promise<Space> {
    const count = await this.userSpaceService.getUsersCountBySpaceId(spaceId)
    return this.spaceService.updateMembersCount(count, spaceId)
  }
}
