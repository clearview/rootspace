import { getCustomRepository } from 'typeorm'
import { ContentAccessRepository } from '../../database/repositories/ContentAccessRepository'
import { ContentAccess } from '../../database/entities/ContentAccess'
import { Node } from '../../database/entities/Node'
import { NodeContentMediator } from '../content/NodeContentMediator'
import { ContentAccessCreateValue, ContentAccessUpdateValue } from './values'
import { clientError, HttpErrName, HttpStatusCode } from '../../response/errors'
import { ContentEntity } from '../../root/types'
import { ContentEntityNames, NodeContentType, NodeType, NodeTypeEntityNameMap } from '../../shared/constants'
import { ContentAccessType } from './ContentAccessType'
import { Service } from '../Service'
import { EntityService } from '../'
import { ServiceFactory } from '../factory/ServiceFactory'
import { ContentAccessActivity } from '../activity/activities/content/content-access/ContentAccessActivity'
import { Doc } from '../../database/entities/Doc'

export class ContentAccessService extends Service {
  private nodeContentMediator: NodeContentMediator
  private entityService: EntityService

  private static instance: ContentAccessService

  private constructor() {
    super()
    this.entityService = ServiceFactory.getInstance().getEntityService()
  }

  static getInstance() {
    if (!ContentAccessService.instance) {
      ContentAccessService.instance = new ContentAccessService()
    }

    return ContentAccessService.instance
  }

  setMediator(mediator: NodeContentMediator) {
    this.nodeContentMediator = mediator
  }

  private getRepository(): ContentAccessRepository {
    return getCustomRepository(ContentAccessRepository)
  }

  getById(id: number): Promise<ContentAccess> {
    return this.getRepository().findOne(id)
  }

  async requireById(id: number): Promise<ContentAccess> {
    const contentAccess = this.getById(id)

    if (contentAccess) {
      return contentAccess
    }

    throw clientError('Entity not found', HttpErrName.EntityNotFound, HttpStatusCode.NotFound)
  }

  getByNodeId(nodeId: number): Promise<ContentAccess> {
    return this.getRepository().getByNodeId(nodeId)
  }

  async requireByNodeId(nodeId: number): Promise<ContentAccess> {
    const contentAccess = await this.getByNodeId(nodeId)

    if (contentAccess) {
      return contentAccess
    }

    throw clientError('Entity not found', HttpErrName.EntityNotFound, HttpStatusCode.NotFound)
  }

  getForEntity(entity: ContentEntity): Promise<ContentAccess> {
    const entityName = entity.constructor.name

    if (ContentEntityNames.has(entityName) === false) {
      throw new Error('Invalid content entity name')
    }

    return this.getRepository().getByEntityIdAndEntity(entity.id, entityName)
  }

  async requireForEntity(entity: ContentEntity): Promise<ContentAccess> {
    const contentAccess = await this.getForEntity(entity)

    if (contentAccess) {
      return contentAccess
    }

    throw clientError('Entity not found', HttpErrName.EntityNotFound, HttpStatusCode.NotFound)
  }

  async nodeCreated(node: Node, parent: Node): Promise<void> {
    await this.create(
      ContentAccessCreateValue.fromObject({
        spaceId: node.spaceId,
        ownerId: node.userId,
        nodeId: node.id,
        entityId: node.contentId,
        entity: NodeTypeEntityNameMap.get(node.type),
        type: ContentAccessType.Open,
        public: false,
      })
    )
  }

  async create(data: ContentAccessCreateValue): Promise<ContentAccess> {
    return await this.getRepository().save(data.attributes)
  }

  async update(data: ContentAccessUpdateValue, id: number, actorId: number) {
    const contentAccess = await this.requireById(id)

    const newAccess = Object.assign({}, contentAccess, data.attributes)

    await this.getRepository().save(newAccess)
    // await this.nodeContentMediator.contentAccessUpdated(contentAccess)

    const entity = await this.entityService.getEntityByNameAndId<Doc>(newAccess.entity, newAccess.entityId)

    // comparing last saved access with newly updated access
    // sharing type changed from 'restricted' to 'open'
    if (contentAccess.type === 'restricted' && data.attributes.type === 'open') {
      console.log("Content acces change to 'Open'")
      await this.notifyActivity(ContentAccessActivity.open(entity, actorId, newAccess))
    }

    // sharing type changed from 'open' to 'restricted'
    if (contentAccess.type === 'open' && data.attributes.type === 'restricted') {
      console.log("Content acces change to 'Restricted'")
      await this.notifyActivity(ContentAccessActivity.restricted(entity, actorId, newAccess))
    }

    // sharing type changed from 'public' to 'private'
    if (contentAccess.public && !data.attributes.public) {
      console.log("Content acces change to 'Private'")
      await this.notifyActivity(ContentAccessActivity.private(entity, actorId, newAccess))
    }

    // sharing type changed from 'private' to 'public'
    if (!contentAccess.public && data.attributes.public) {
      console.log("Content acces change to 'Public'")
      await this.notifyActivity(ContentAccessActivity.public(entity, actorId, newAccess))
    }

    return newAccess
  }

  async nodeAccessUpdated(node: Node, descendants: Node[], contentAccess?: ContentAccess): Promise<void> {
    const access = contentAccess ?? (await this.requireByNodeId(node.id))
    const ids = descendants.map((descendant) => descendant.id)

    await this.getRepository().updateByNodeIds(ids, {
      type: access.type,
      public: access.public,
    })
  }

  async nodeMoved(node: Node, toParent: Node, descendants: Node[]): Promise<void> {
    const updateSet = {
      type: ContentAccessType.Open,
      public: false,
    }

    if (toParent.type === NodeType.Private) {
      updateSet.type = ContentAccessType.Private
    }

    if (Object.values(NodeContentType).includes(toParent.type)) {
      const contentAccess = await this.requireByNodeId(toParent.id)
      updateSet.type = contentAccess.type
      updateSet.public = contentAccess.public
    }

    const ids = [node.id]
    ids.push(...descendants.map((descendant) => descendant.id))

    await this.getRepository().updateByNodeIds(ids, updateSet)
  }
}
