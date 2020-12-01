import { DocUpdateValue } from '../../../values/doc'
import { Doc } from '../../../database/entities/Doc'
import { IDocContent } from '../../../types/doc'

// seconds
const revisonIdleTime = 180

export class DocUpdateSetup {
  protected _data: DocUpdateValue
  protected _doc: Doc
  protected _userId: number
  protected _time: number

  private _updatedAttributes: string[] = []
  private _contentUpdated: boolean = false
  private _createRevision: boolean = false
  private _registerActivity: boolean = false

  constructor(data: DocUpdateValue, doc: Doc, userId: number) {
    this._data = data
    this._doc = doc
    this._userId = userId
    this._time = Date.now()

    this._contentUpdated = this.isContentUpdated()
    this._updatedAttributes = this.getUpdatedAttributes()
    this._createRevision = this.doCreateRevision()
    this._registerActivity = this.doRegisterActivity()
  }

  get contentUpdated(): boolean {
    return this._contentUpdated
  }

  get updatedAttributes(): string[] {
    return this._updatedAttributes
  }

  get createRevision(): boolean {
    return this._createRevision
  }

  get registerActivity(): boolean {
    return this._registerActivity
  }

  protected isContentUpdated(): boolean {
    if (this._data.attributes.content === undefined) {
      return false
    }

    const dataContent = this._data.attributes.content as IDocContent
    const docContent = this._doc.content as IDocContent

    const dataContentJson = JSON.stringify(dataContent.blocks)
    const docContentJson = JSON.stringify(docContent.blocks)

    if (docContentJson === dataContentJson) {
      return false
    }

    return true
  }

  protected getUpdatedAttributes(): string[] {
    const attributes = ['title', 'content']
    const updated = []

    for (const attr of attributes) {
      if (!this._data.attributes.hasOwnProperty(attr)) {
        continue
      }

      if (attr === 'content') {
        if (this.isContentUpdated()) {
          updated.push(attr)
        }

        continue
      }

      if (this._data.attributes[attr] !== this._doc[attr]) {
        updated.push(attr)
      }
    }

    return updated
  }

  protected doCreateRevision(): boolean {
    if (this.contentUpdated === false) {
      return false
    }

    if (this.isNewUserUpdating()) {
      return true
    }

    if (this.isDocContentEmpty()) {
      return false
    }

    // seconds
    const timeSpan = (this._time - this._doc.contentUpdatedAt.valueOf()) / 1000

    if (timeSpan > revisonIdleTime) {
      return true
    }

    return false
  }

  protected doRegisterActivity(): boolean {
    if (this._updatedAttributes.length === 0) {
      return false
    }

    if (this.isOnlyContentUpdated() && !this.createRevision) {
      return false
    }

    return true
  }

  protected isDocContentEmpty(): boolean {
    const content = this._doc.content as IDocContent
    if (content.blocks === undefined) {
      return true
    }

    if (content.blocks.length === 0) {
      return true
    }

    return false
  }

  protected isNewUserUpdating(): boolean {
    if (this._doc.contentUpdatedBy === this._userId) {
      return false
    }

    if (this._doc.contentUpdatedBy === null && this._doc.userId === this._userId) {
      return false
    }

    return true
  }

  protected isOnlyContentUpdated() {
    if (this._updatedAttributes.length === 1 && this._updatedAttributes[0] === 'content') {
      return true
    }

    return false
  }
}
