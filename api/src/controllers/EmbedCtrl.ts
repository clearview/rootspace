import { Request, Response } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { ServiceFactory } from '../services/factory/ServiceFactory'
import { EmbedService } from '../services'
import { validateEmbedCreate, validateEmbedUpdate } from '../validation/embed'
import { EmbedCreateValue, EmbedUpdateValue } from '../values/embed'
import { Actions } from '../middleware/AuthMiddleware'
import { ForbiddenError } from '@casl/ability'

export class EmbedCtrl extends BaseCtrl {
  private embedService: EmbedService

  constructor() {
    super()
    this.embedService = ServiceFactory.getInstance().getEmbedService()
  }

  async view(req: Request, res: Response) {
    const embed = await this.embedService.requireEmbedById(
      Number(req.params.id)
    )

    ForbiddenError.from(req.user.ability).throwUnlessCan(Actions.Read, embed)

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
    const id = Number(req.params.id)
    const data = req.body.data

    await validateEmbedUpdate(data)

    const value = EmbedUpdateValue.fromObject(data)
    const embed = await this.embedService.update(value, id)

    res.send(this.responseData(embed))
  }

  async delete(req: Request, res: Response) {
    const emebd = await this.embedService.remove(Number(req.params.id))
    res.send(this.responseData(emebd))
  }
}
