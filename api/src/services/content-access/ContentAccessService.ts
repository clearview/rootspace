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

export class ContentAccessService {
  private nodeContentMediator: NodeContentMediator

  private static instance: ContentAccessService

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

  async update(data: ContentAccessUpdateValue, id: number) {
    const contentAccess = await this.requireById(id)

    Object.assign(contentAccess, data.attributes)

    await this.getRepository().save(contentAccess)
    // await this.nodeContentMediator.contentAccessUpdated(contentAccess)

    return contentAccess
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
