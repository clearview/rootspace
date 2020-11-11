import { DocUpdateValue } from '../../../values/doc'
import { Doc } from '../../../database/entities/Doc'

// seconds
const revisonIdleTime = 180

export class DocUpdateSetup {
  private _data: DocUpdateValue
  private _doc: Doc
  private _userId: number
  private _time: number

  private _updatedAttributes: string[] = []

  private _contentUpdated: boolean = false
  private _createRevision: boolean = false
  private _registerActivity: boolean = false

  constructor(data: DocUpdateValue, doc: Doc, userId: number) {
    this._data = data
    this._doc = doc
    this._userId = userId
    this._time = Date.now()

    this._contentUpdated = this._isContentUpdated()
    this._updatedAttributes = this._getUpdatedAttributes()
    this._createRevision = this._doCreateRevision()
    this._registerActivity = this._doRegisterActivity()
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

  private _isContentUpdated(): boolean {
    if (this._data.attributes.content === undefined) {
      return false
    }

    const dataContentJson = JSON.stringify(this._data.attributes.content.blocks)
    const docContentJson = JSON.stringify(this._doc.content.blocks)

    if (docContentJson === dataContentJson) {
      return false
    }

    return true
  }

  private _getUpdatedAttributes(): string[] {
    const attributes = ['title', 'content']
    const updated = []

    for (const attr of attributes) {
      if (!this._data.attributes.hasOwnProperty(attr)) {
        continue
      }

      if (attr === 'content') {
        if (this._isContentUpdated()) {
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

  private _doCreateRevision(): boolean {
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

  private _doRegisterActivity(): boolean {
    if (this._updatedAttributes.length === 0) {
      return false
    }

    if (this.isOnlyContentUpdated() && !this.createRevision) {
      return false
    }

    return true
  }

  private isDocContentEmpty(): boolean {
    if (this._doc.content.blocks === undefined) {
      return true
    }

    if (this._doc.content.blocks.length === 0) {
      return true
    }

    return false
  }

  private isNewUserUpdating(): boolean {
    if (this._doc.contentUpdatedBy === this._userId) {
      return false
    }

    if (this._doc.contentUpdatedBy === null && this._doc.userId === this._userId) {
      return false
    }

    return true
  }

  private isOnlyContentUpdated() {
    if (this._updatedAttributes.length === 1 && this._updatedAttributes[0] === 'content') {
      return true
    }

    return false
  }
}
