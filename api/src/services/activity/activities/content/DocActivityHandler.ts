import { Doc } from '../../../../database/entities/Doc'
import { ContentActivityHandler } from './ContentActivityHandler'
import { IContentActivityData } from './types'

export class DocActivityHandler extends ContentActivityHandler<Doc> {
  constructor(data: IContentActivityData) {
    super(data)
  }

  async process(): Promise<void> {
    await this.init()
  }
}