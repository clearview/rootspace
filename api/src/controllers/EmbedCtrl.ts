import { Request, Response } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { validateEmbedCreate, validateEmbedUpdate, EmbedCreateValue, EmbedUpdateValue } from '../services/content/embed'
import { ServiceFactory } from '../services/factory/ServiceFactory'
import { EmbedService } from '../services'

export class EmbedCtrl extends BaseCtrl {
  private embedService: EmbedService

  constructor() {
    super()
    this.embedService = ServiceFactory.getInstance().getEmbedService()
  }

  async view(req: Request, res: Response) {
    const embed = await this.embedService.requireEmbedById(Number(req.params.id))
    this.isSpaceMember(req, embed.spaceId)

    res.send(this.responseData(embed))
  }

  async create(req: Request, res: Response) {
    const data = req.body.data
    await validateEmbedCreate(data)

    const value = EmbedCreateValue.fromObjectAndUserId(data, req.user.id)
    const embed = await this.embedService.create(value)

    res.send(this.responseData(embed))
  }

  async update(req: Request, res: Response) {
    const data = req.body.data
    await validateEmbedUpdate(data)

    const embed = await this.embedService.requireEmbedById(Number(req.params.id))
    this.isSpaceMember(req, embed.spaceId)

    const value = EmbedUpdateValue.fromObject(data)
    const result = await this.embedService.update(value, embed.id, req.user.id)

    res.send(this.responseData(result))
  }

  async archive(req: Request, res: Response) {
    const id = Number(req.params.id)
    const result = await this.embedService.archive(id, req.user.id)

    res.send(this.responseData(result))
  }

  async restore(req: Request, res: Response) {
    const embed = await this.embedService.requireEmbedById(Number(req.params.id))
    this.isSpaceMember(req, embed.spaceId)

    const result = await this.embedService.restore(embed.id, req.user.id)
    res.send(this.responseData(result))
  }

  async delete(req: Request, res: Response) {
    const embed = await this.embedService.requireEmbedById(Number(req.params.id))
    this.isSpaceMember(req, embed.spaceId)

    const result = await this.embedService.remove(embed.id, req.user.id)
    res.send(this.responseData(result))
  }
}
