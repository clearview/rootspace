import { Request, Response } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { NodeUpdateValue } from '../values/node'
import { validateNodeUpdate } from '../validation/node'
import { NodeService } from '../services/content/NodeService'
import { ServiceFactory } from '../services/factory/ServiceFactory'

export class NodeCtrl extends BaseCtrl {
  protected nodeService: NodeService

  constructor() {
    super()
    this.nodeService = ServiceFactory.getInstance().getNodeService()
  }

  async update(req: Request, res: Response) {
    const id = Number(req.params.id)
    const data = req.body.data

    await validateNodeUpdate(data)
    let value = NodeUpdateValue.fromObject(data)

    if (data.parent !== undefined) {
      value = value.withParent(data.parent)
    }

    if (data.position !== undefined) {
      value = value.withPosition(data.position)
    }

    const node = await this.nodeService.update(value, id)
    const resData = this.responseData(node)

    res.send(resData)
  }

  async archive(req: Request, res: Response) {
    const resutl = await this.nodeService.archive(Number(req.params.id))
    res.send(this.responseData(resutl))
  }

  async restore(req: Request, res: Response) {
    const resutl = await this.nodeService.restore(Number(req.params.id))
    res.send(this.responseData(resutl))
  }

  async delete(req: Request, res: Response) {
    const result = await this.nodeService.remove(Number(req.params.id))
    res.send(result)
  }
}
