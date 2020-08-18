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

  async create(data: EmbedCreateValue): Promise<Embed> {
    const embed = await this.getEmbedRepository().save(data.attributes)

    await this.nodeService.create(
      NodeCreateValue.fromObject({
        userId: embed.userId,
        spaceId: embed.spaceId,
        contentId: embed.id,
        title: embed.title,
        type: NodeType.Embed,
      })
    )

    return embed
  }

  async update(data: EmbedUpdateValue, id: number): Promise<Embed> {
    let embed = await this.requireEmbedById(id)

    Object.assign(embed, data.attributes)
    embed = await this.getEmbedRepository().save(embed)

    await this.nodeContentMediator.contentUpdated(embed.id, this.getNodeType(), {
      title: embed.title,
    })

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
    const embed = await this.getEmbedRepository().softRemove(_embed)
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
    await this._remove(embed)
  }

  private async _remove(embed: Embed) {
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
