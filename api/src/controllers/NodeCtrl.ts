import { Request, Response } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { LinkUpdateValue } from '../values/link'
import { validateLinkUpdate } from '../validation/link'
import { clientError } from '../errors'
import { NodeService } from '../services/NodeService'

export class NodeCtrl extends BaseCtrl {
  protected nodeService: NodeService

  constructor() {
    super()
    this.nodeService = NodeService.getInstance()
  }

  public async view(req: Request, res: Response) {
    const spaceId = Number(req.params.spaceId)

    if (!spaceId) {
      throw clientError('Error fetching tree')
    }

    const nodes = await this.nodeService.getTreeBySpaceId(spaceId)
    const data = this.responseData(nodes)

    res.send(data)
  }

  public async update(req: Request, res: Response) {
    const nodeId = Number(req.params.nodeId)
    const data = req.body.data

    await validateLinkUpdate(data)

    const value = LinkUpdateValue.fromObject(data)

    if (data.parent !== undefined) {
      value.parent = data.parent
    }

    if (data.position !== undefined) {
      value.position = data.position
    }

    const link = await this.nodeService.update(value, nodeId)
    const resData = this.responseData(link)

    res.send(resData)
  }

  public async delete(req: Request, res: Response) {
    const result = await this.nodeService.delete(Number(req.params.id))
    res.send(result)
  }
}
