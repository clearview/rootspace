import { DocUpdateValue } from '../../../values/doc'
import { Doc } from '../../../database/entities/Doc'
import { DocUpdateSetup } from './DocUpdateSetup'
import { INovaDocContent } from '../../../types/doc'

export class NovaDocUpdateSetup extends DocUpdateSetup {
  constructor(data: DocUpdateValue, doc: Doc, userId: number) {
    super(data, doc, userId)
  }

  protected isContentUpdated(): boolean {
    if (this._data.attributes.content === undefined) {
      return false
    }

    const dataContent = this._data.attributes.content as INovaDocContent
    const docContent = this._doc.content as INovaDocContent

    const dataContentJson = JSON.stringify(dataContent.content)
    const docContentJson = JSON.stringify(docContent.content)

    if (docContentJson === dataContentJson) {
      return false
    }

    return true
  }

  protected isDocContentEmpty(): boolean {
    return false
  }

  protected doCreateRevision(): boolean {
    return false
  }

  protected doRegisterActivity(): boolean {
    return false
  }
}
