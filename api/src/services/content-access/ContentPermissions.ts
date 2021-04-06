import { ContentAccess } from '../../database/entities/ContentAccess'
import { UserToSpace } from '../../database/entities/UserToSpace'
import { clientError, HttpErrName, HttpStatusCode } from '../../response/errors'
import { SpaceUserRole } from '../../types/spaceUser'
import { ContentAccessType } from './ContentAccessType'
import { ServiceFactory } from '../factory/ServiceFactory'

type permission = 'view' | 'update' | 'archive' | 'restore' | 'delete'

export class ContentPermissions {
  private defined = new Set<permission>(['view', 'update', 'archive', 'restore', 'delete'])
  private list = new Set<string>()

  private contentAccess: ContentAccess
  private spaceUser: UserToSpace

  constructor(contentAccess: ContentAccess, spaceUSer?: UserToSpace) {
    this.contentAccess = contentAccess
    this.spaceUser = spaceUSer

    this.defined.forEach((action) => {
      if (action === 'view' && this.view() === true) {
        this.list.add(action)
      }

      if (this.default() === true) {
        this.list.add(action)
      }
    })
  }

  getContentAccess(): ContentAccess {
    return this.contentAccess
  }

  getList(): string[] {
    return Array.from(this.list)
  }

  has(permission: permission): boolean {
    console.log(this.list)

    return this.list.has(permission)
  }

  throwUnlessHas(permission: permission) {
    if (this.has(permission) === false) {
      throw clientError('Content action forbidden', HttpErrName.Forbidden, HttpStatusCode.Forbidden)
    }
  }

  private view(): boolean {
    if (!this.contentAccess) {
      return this.isUserSpaceMember()
    }

    if (this.contentAccess.public) {
      return true
    }

    if (!this.spaceUser) {
      return false
    }

    if (this.contentAccess.type === ContentAccessType.Open) {
      return this.isUserSpaceMember()
    }

    if (this.contentAccess.type === ContentAccessType.Restricted) {
      return this.isUserSpaceMember()
    }

    if (this.contentAccess.type === ContentAccessType.Private) {
      return this.isUserContentOwner()
    }

    return false
  }

  private default(): boolean {
    if (!this.contentAccess) {
      return this.isUserSpaceMember()
    }

    if (this.contentAccess.type === ContentAccessType.Open) {
      return this.isUserSpaceMember()
    }

    if (this.contentAccess.type === ContentAccessType.Restricted) {
      return this.isUserSpaceAdmin()
    }

    if (this.contentAccess.type === ContentAccessType.Private) {
      return this.isUserContentOwner()
    }

    return false
  }

  private isUserSpaceMember(): boolean {
    if (!this.spaceUser) {
      return false
    }

    return true
  }

  private isUserSpaceAdmin(): boolean {
    if (!this.spaceUser) {
      return false
    }

    return this.spaceUser.role === SpaceUserRole.Admin ? true : false
  }

  private isUserContentOwner(): boolean {
    if (!this.spaceUser) {
      return false
    }

    return this.contentAccess.ownerId === this.spaceUser.userId ? true : false
  }
}

export const contentPermissions = async (entity: any, userId?: number): Promise<ContentPermissions> => {
  const contentAccess = await ServiceFactory.getInstance()
    .getContentAccessService()
    .getForEntity(entity.id, entity.constructor.name)

  const spaceUser = !userId
    ? null
    : await ServiceFactory.getInstance()
        .getUserSpaceService()
        .getByUserIdAndSpaceId(userId, entity.spaceId, { active: true })

  return new ContentPermissions(contentAccess, spaceUser)
}

export const hasContentPermission = async (permission: permission, entity: any, userId?: number) => {
  const permissions = await contentPermissions(entity, userId)
  permissions.throwUnlessHas(permission)
}
