import httpRequestContext from 'http-request-context'
import { getCustomRepository } from 'typeorm'
import { EmbedRepository } from '../../database/repositories/EmbedRepository'
import { Embed } from '../../database/entities/Embed'
import { EmbedCreateValue, EmbedUpdateValue } from '../../values/embed'
import { NodeCreateValue } from '../../values/node'
import { NodeType } from '../../types/node'
import { NodeService } from './NodeService'
import { NodeContentService } from './NodeContentService'
import { INodeContentUpdate } from './contracts'
import { clientError, HttpErrName, HttpStatusCode } from '../../errors'
import { ServiceFactory } from '../factory/ServiceFactory'
import Bull from 'bull'
import { ActivityEvent } from '../events/ActivityEvent'
import { ActivityService } from '../ActivityService'
import { EmbedActivities } from '../../database/entities/activities/EmbedActivities'
import { Node } from '../../database/entities/Node'

export class EmbedService extends NodeContentService {
  private nodeService: NodeService
  private activityService: ActivityService

  private constructor() {
    super()
    this.nodeService = ServiceFactory.getInstance().getNodeService()
    this.activityService = ServiceFactory.getInstance().getActivityService()
  }

  private static instance: EmbedService

  static getInstance() {
    if (!EmbedService.instance) {
      EmbedService.instance = new EmbedService()
    }

    return EmbedService.instance
  }

  getNodeType(): NodeType {
    return NodeType.Embed
  }

  getEmbedRepository(): EmbedRepository {
    return getCustomRepository(EmbedRepository)
  }

  getEmbedById(id: number, options: any = {}): Promise<Embed | undefined> {
    return this.getEmbedRepository().getById(id, options)
  }

  async requireEmbedById(id: number, options: any = {}): Promise<Embed> {
    const embed = await this.getEmbedById(id, options)

    if (!embed) {
      throw clientError('Embed not found', HttpErrName.EntityNotFound, HttpStatusCode.NotFound)
    }

    return embed
  }

  async create(data: EmbedCreateValue): Promise<Embed & Node> {
    let embed = await this.getEmbedRepository().save(data.attributes)

    let value = NodeCreateValue.fromObject({
      userId: embed.userId,
      spaceId: embed.spaceId,
      contentId: embed.id,
      title: embed.title,
      type: NodeType.Embed,
    })
    if (data.attributes.parentId) {
      value = value.withParent(data.attributes.parentId).withPosition(0)
    }
    const node = await this.nodeService.create(
      value
    )

    embed = await this.getEmbedRepository().reload(embed)
    await this.registerActivityForEmbed(EmbedActivities.Created, embed, { title: embed.title })

    return { ...embed, ...node }
  }

  async update(data: EmbedUpdateValue, id: number): Promise<Embed> {
    const existingEmbed = await this.requireEmbedById(id)
    let embed = await this.requireEmbedById(id)

    Object.assign(embed, data.attributes)
    embed = await this.getEmbedRepository().save(embed)

    await this.nodeContentMediator.contentUpdated(embed.id, this.getNodeType(), { title: embed.title })

    const fields = { old: {}, new: {} }

    for (const key of Object.keys(data.attributes)) {
      if (data.attributes[key] !== existingEmbed[key]) {
        fields.old[key] = existingEmbed[key]
        fields.new[key] = embed[key]
      }
    }

    await this.registerActivityForEmbed(EmbedActivities.Updated, embed, fields)

    return embed
  }

  async nodeUpdated(contentId: number, data: INodeContentUpdate): Promise<void> {
    const embed = await this.getEmbedById(contentId)

    if (!embed) {
      return
    }

    embed.title = data.title
    await this.getEmbedRepository().save(embed)
  }

  async archive(id: number): Promise<Embed> {
    let embed = await this.requireEmbedById(id, { withDeleted: true })
    this.verifyArchive(embed)

    embed = await this._archive(embed)
    await this.nodeContentMediator.contentArchived(embed.id, this.getNodeType())

    return embed
  }

  async nodeArchived(contentId: number): Promise<void> {
    const embed = await this.getEmbedById(contentId)

    if (!embed) {
      return
    }

    await this._archive(embed)
  }

  private async _archive(_embed: Embed): Promise<Embed> {
    await this.registerActivityForEmbed(EmbedActivities.Archived, _embed, { title: _embed.title })
    return this.getEmbedRepository().softRemove(_embed)
  }

  async restore(id: number): Promise<Embed> {
    let embed = await this.requireEmbedById(id, { withDeleted: true })
    this.verifyRestore(embed)

    embed = await this._restore(embed)
    await this.nodeContentMediator.contentRestored(embed.id, this.getNodeType())

    return embed
  }

  async nodeRestored(contentId: number): Promise<void> {
    const embed = await this.getEmbedById(contentId, { withDeleted: true })

    if (!embed) {
      return
    }

    await this._restore(embed)
  }

  private async _restore(_embed: Embed): Promise<Embed> {
    const embed = await this.getEmbedRepository().recover(_embed)
    await this.registerActivityForEmbed(EmbedActivities.Restored, embed, { title: embed.title })
    return embed
  }

  async remove(id: number): Promise<Embed> {
    let embed = await this.requireEmbedById(id, { withDeleted: true })
    // this.verifyRemove(embed)

    embed = await this._remove(embed)
    await this.nodeContentMediator.contentRemoved(id, this.getNodeType())

    return embed
  }

  async nodeRemoved(contentId: number): Promise<void> {
    const embed = await this.getEmbedById(contentId, { withDeleted: true })

    if (embed) {
      await this._remove(embed)
    }
  }

  private async _remove(embed: Embed) {
    await this.registerActivityForEmbed(EmbedActivities.Deleted, embed, { title: embed.title })
    return this.getEmbedRepository().remove(embed)
  }

  private verifyArchive(embed: Embed): void {
    if (embed.deletedAt !== null) {
      throw clientError('Can not archive embed', HttpErrName.NotAllowed, HttpStatusCode.NotAllowed)
    }
  }

  private verifyRestore(embed: Embed) {
    if (embed.deletedAt === null) {
      throw clientError('Can not restore embed', HttpErrName.NotAllowed, HttpStatusCode.NotAllowed)
    }
  }

  private verifyRemove(embed: Embed): void {
    if (embed.deletedAt === null) {
      throw clientError('Can not delete embed', HttpErrName.NotAllowed, HttpStatusCode.NotAllowed)
    }
  }

  async registerActivityForEmbedId(embedActivity: EmbedActivities, embedId: number, context?: any): Promise<Bull.Job> {
    const embed = await this.getEmbedById(embedId)
    return this.registerActivityForEmbed(embedActivity, embed, context)
  }

  async registerActivityForEmbed(embedActivity: EmbedActivities, embed: Embed, context?: any): Promise<Bull.Job> {
    const actor = httpRequestContext.get('user')

    return this.activityService.add(
      ActivityEvent.withAction(embedActivity)
        .fromActor(actor.id)
        .forEntity(embed)
        .inSpace(embed.spaceId)
        .withContext(context)
    )
  }
}
