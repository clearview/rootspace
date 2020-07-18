import { getCustomRepository } from 'typeorm'
import { EmbedRepository } from '../../repositories/EmbedRepository'
import { Embed } from '../../database/entities/Embed'
import { EmbedCreateValue, EmbedUpdateValue } from '../../values/embed'
import { NodeCreateValue } from '../../values/node'
import { NodeType } from '../../types/node'
import { NodeService } from './NodeService'
import { NodeContentService } from './NodeContentService'
import { INodeContentUpdate } from './contracts'
import { clientError, HttpErrName, HttpStatusCode } from '../../errors'

export class EmbedService extends NodeContentService {
  private nodeService: NodeService

  private constructor() {
    super()
    this.nodeService = NodeService.getInstance()
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

  getEmbedById(id: number): Promise<Embed | undefined> {
    return this.getEmbedRepository().findOne(id)
  }

  async requireEmbedById(id: number): Promise<Embed> {
    const embed = await this.getEmbedById(id)

    if (!embed) {
      throw clientError(
        'Embed not found',
        HttpErrName.EntityNotFound,
        HttpStatusCode.NotFound
      )
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

    await this.mediator.contentUpdated(embed.id, this.getNodeType(), {
      title: embed.title,
    })

    return embed
  }

  async remove(id: number): Promise<Embed> {
    let embed = await this.requireEmbedById(id)

    embed = await this.getEmbedRepository().remove(embed)
    await this.mediator.contentRemoved(id, this.getNodeType())

    return embed
  }

  async nodeUpdated(
    contentId: number,
    data: INodeContentUpdate
  ): Promise<void> {
    const embed = await this.getEmbedById(contentId)

    if (!embed) {
      return
    }

    embed.title = data.title
    await this.getEmbedRepository().save(embed)
  }

  async nodeRemoved(contentId: number): Promise<void> {
    const embed = await this.getEmbedRepository().findOne({ id: contentId })
    await this.getEmbedRepository().remove(embed)
  }
}
