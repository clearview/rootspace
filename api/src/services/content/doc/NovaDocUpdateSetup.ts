import { DocUpdateValue } from '../../../values/doc'
import { Doc } from '../../../database/entities/Doc'
import { IDocUpdateSetup } from '../../../types/doc'

export class NovaDocUpdateSetup implements IDocUpdateSetup {
  private _data: DocUpdateValue
  private _doc: Doc

  private _updatedAttributes: string[] = []
  private _contentUpdated: boolean = false
  private _createRevision: boolean = false
  private _registerActivity: boolean = false

  constructor(data: DocUpdateValue, doc: Doc) {
    this._data = data
    this._doc = doc

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
    if (this._data.attributes.contentState === undefined) {
      return false
    }

    const dataContentState = this._data.attributes.contentState
    const docContentState = this._doc.contentState

    if (JSON.stringify(dataContentState) === JSON.stringify(docContentState)) {
      return false
    }

    return true
  }

  private _getUpdatedAttributes(): string[] {
    const attributes = ['title', 'contentState']
    const updated = []

    for (const attr of attributes) {
      if (!this._data.attributes.hasOwnProperty(attr)) {
        continue
      }

      if (attr === 'contentState') {
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

    if (this._doc.contentState === null) {
      return false
    }

    return true
  }

  private _doRegisterActivity(): boolean {
    if (this._updatedAttributes.length === 0) {
      return false
    }

    if (this._isOnlyContentUpdated() && !this.createRevision) {
      return false
    }

    return true
  }

  private _isOnlyContentUpdated() {
    if (this._updatedAttributes.length === 1 && this._updatedAttributes[0] === 'contentState') {
      return true
    }

    return false
  }
}
