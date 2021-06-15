import { ContentAccess } from '../../database/entities/ContentAccess'
import { UserToSpace } from '../../database/entities/UserToSpace'
import { SpaceUserRole } from '../user-space'
import { ContentAccessType } from './ContentAccessType'
import { ContentEntity } from '../../root/types'
import { ServiceFactory } from '../factory/ServiceFactory'
import { clientError, HttpErrName, HttpStatusCode } from '../../response/errors'
import { Node } from '../../database/entities/Node'

type permissionType = 'view' | 'update' | 'archive' | 'restore' | 'delete'

export class ContentPermissions {
  private defined = new Set<permissionType>(['view', 'update', 'archive', 'restore', 'delete'])
  private list = new Set<string>()

  private contentAccess: ContentAccess
  private spaceUser: UserToSpace

  constructor(contentAccess: ContentAccess, spaceUser?: UserToSpace) {
    this.contentAccess = contentAccess
    this.spaceUser = spaceUser

    this.defined.forEach((action) => {
      if (action === 'view' && this.view() === true) {
        this.list.add(action)
        return
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

  has(permission: permissionType): boolean {
    return this.list.has(permission)
  }

  throwUnlessHas(permission: permissionType) {
    if (this.has(permission) === false) {
      throw clientError('Content action forbidden', HttpErrName.Forbidden, HttpStatusCode.Forbidden)
    }
  }

  private view(): boolean {
    if (!this.contentAccess) {
      return this.isUserSpaceMember()
    }

    if (this.contentAccess.public === true) {
      return true
    }

    if (!this.spaceUser) {
      return false
    }

    if (this.isUserContentOwner() === true) {
      return true
    }

    if (this.contentAccess.type === ContentAccessType.Open) {
      return this.isUserSpaceMember()
    }

    if (this.contentAccess.type === ContentAccessType.Restricted) {
      return this.isUserSpaceMember()
    }

    return false
  }

  private default(): boolean {
    if (!this.contentAccess) {
      return this.isUserSpaceMember()
    }

    if (!this.spaceUser) {
      return false
    }

    if (this.isUserContentOwner() === true) {
      return true
    }

    if (this.contentAccess.type === ContentAccessType.Open) {
      return this.isUserSpaceMember()
    }

    if (this.contentAccess.type === ContentAccessType.Restricted) {
      return this.isUserSpaceAdmin()
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

export const hasNodePermission = async (permission: permissionType, node: Node, userId?: number) => {
  const permissions = await nodePermissions(node, userId)
  permissions.throwUnlessHas(permission)
}

export const hasContentPermission = async (permission: permissionType, entity: ContentEntity, userId?: number) => {
  const permissions = await contentPermissions(entity, userId)
  permissions.throwUnlessHas(permission)
}

export const nodePermissions = async (node: Node, userId?: number): Promise<ContentPermissions> => {
  const contentAccess = await ServiceFactory.getInstance()
    .getContentAccessService()
    .requireByNodeId(node.id)

  const spaceUser = !userId
    ? null
    : await ServiceFactory.getInstance()
        .getUserSpaceService()
        .getByUserIdAndSpaceId(userId, node.spaceId, { active: true })

  return new ContentPermissions(contentAccess, spaceUser)
}

export const contentPermissions = async (entity: ContentEntity, userId?: number): Promise<ContentPermissions> => {
  const contentAccess = await ServiceFactory.getInstance()
    .getContentAccessService()
    .requireForEntity(entity)

  const spaceUser = !userId
    ? null
    : await ServiceFactory.getInstance()
        .getUserSpaceService()
        .getByUserIdAndSpaceId(userId, entity.spaceId, { active: true })

  return new ContentPermissions(contentAccess, spaceUser)
}
