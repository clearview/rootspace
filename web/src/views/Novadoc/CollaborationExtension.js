import { keymap } from 'prosemirror-keymap'
import { Extension } from 'tiptap'
import { redo, undo, yCursorPlugin, ySyncPlugin, yUndoPlugin } from 'y-prosemirror'

export default class CollaborationExtension extends Extension {
  constructor (provider, type) {
    super()
    this._provider = provider
    this._type = type
  }

  get name () {
    return 'collaboration'
  }

  get plugins () {
    return [
      ySyncPlugin(this._type),
      yCursorPlugin(this._provider.awareness),
      yUndoPlugin(),
      keymap({
        'Mod-z': undo,
        'Mod-y': redo,
        'Mod-Shift-z': redo
      })
    ]
  }
}
