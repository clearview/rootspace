import { getCustomRepository } from 'typeorm'
import { EmbedRepository } from '../../database/repositories/EmbedRepository'
import { Embed } from '../../database/entities/Embed'
import { EmbedCreateValue, EmbedUpdateValue } from '../../values/embed'
import { NodeCreateValue } from '../../values/node'
import { NodeType } from '../../types/node'
import { NodeService } from './NodeService'
import { NodeContentService } from './NodeContentService'
import { INodeContentUpdate } from './contracts'
import { clientError, HttpErrName, HttpStatusCode } from '../../response/errors'
import { ServiceFactory } from '../factory/ServiceFactory'
import { Node } from '../../database/entities/Node'
import { EmbedActivity } from '../activity/activities/content'

export class EmbedService extends NodeContentService {
  private nodeService: NodeService

  private constructor() {
    super()
    this.nodeService = ServiceFactory.getInstance().getNodeService()
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

    const node = await this.nodeService.create(value)

    embed = await this.getEmbedRepository().reload(embed)
    await this.notifyActivity(EmbedActivity.created(embed))

    return { ...embed, ...node }
  }

  async update(data: EmbedUpdateValue, id: number): Promise<Embed> {
    const embed = await this.requireEmbedById(id)
    const updatedEmbed = await this._update(data, embed)

    if (embed.title !== updatedEmbed.title) {
      this.nodeContentMediator.contentUpdated(embed.id, this.getNodeType(), {
        title: updatedEmbed.title,
      })
    }

    return embed
  }

  async nodeUpdated(contentId: number, data: INodeContentUpdate): Promise<void> {
    const embed = await this.getEmbedById(contentId)

    if (!embed) {
      return
    }

    await this._update(
      EmbedUpdateValue.fromObject({
        title: data.title,
      }),
      embed
    )
  }

  private async _update(data: EmbedUpdateValue, embed: Embed): Promise<Embed> {
    const updatedEmbed = await this.requireEmbedById(embed.id)

    Object.assign(updatedEmbed, data.attributes)

    await this.getEmbedRepository().save(updatedEmbed)
    await this.notifyActivity(EmbedActivity.updated(embed, updatedEmbed))

    return updatedEmbed
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
    const embed = await this.getEmbedRepository().softRemove(_embed)
    await this.notifyActivity(EmbedActivity.archived(embed))

    return embed
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
    await this.notifyActivity(EmbedActivity.restored(embed))

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
    await this.notifyActivity(EmbedActivity.deleted(embed))
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
}
