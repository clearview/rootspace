import { Space } from '../../entities/Space'
import { SpaceCreateValue, SpaceUpdateValue } from '../../values/space'
import { LinkType } from '../../constants'
import { LinkCreateValue } from '../../values/link'
import { SpaceService, LinkService, UserSpaceService } from '../'

export class SpaceFacade {
  private spaceService: SpaceService
  private userSpaceService: UserSpaceService
  private linkService: LinkService

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

    await this.linkService.createSpaceRoot(
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

  async updateSpaceCountMembers(spaceId: number): Promise<Space> {
    const count = await this.userSpaceService.getCountSpaceUsers(spaceId)
    return this.spaceService.updateCountMembers(count, spaceId)
  }
}
