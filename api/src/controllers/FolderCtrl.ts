import { Request, Response } from 'express'
import { BaseCtrl } from './BaseCtrl'
import { NodeService } from '../services'
import { ServiceFactory } from '../services/factory/ServiceFactory'
import {
  validateFolderCreate,
  validateFolderUpdate,
} from '../validation/folder'
import { NodeCreateValue, NodeUpdateValue } from '../values/node'
import { NodeType } from '../types/node'

export class FolderCtrl extends BaseCtrl {
  private nodeService: NodeService

  constructor() {
    super()
    this.nodeService = ServiceFactory.getInstance().getNodeService()
  }

  async create(req: Request, res: Response) {
    const data = req.body.data
    await validateFolderCreate(data)

    const value = NodeCreateValue.fromObject({
      spaceId: data.spaceId,
      userId: req.user.id,
      title: data.title,
      contentId: 0,
      type: NodeType.Folder,
    })

    const node = await this.nodeService.create(value)
    const resData = this.responseData(node)

    res.send(resData)
  }

  async update(req: Request, res: Response) {
    const id = Number(req.params.id)
    const data = req.body.data

    await validateFolderUpdate(data)

    const value = NodeUpdateValue.fromObject({ title: data.title })
    const node = await this.nodeService.update(value, id)

    res.send(this.responseData(node))
  }

  async delete(req: Request, res: Response) {
    const node = await this.nodeService.remove(Number(req.params.id))
    res.send(this.responseData(node))
  }
}
