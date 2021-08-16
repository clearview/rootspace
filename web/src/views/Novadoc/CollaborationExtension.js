import { keymap } from 'prosemirror-keymap'
import { Extension } from 'tiptap'
import { redo, undo, yCursorPlugin, ySyncPlugin, yUndoPlugin } from 'y-prosemirror'

export default class CollaborationExtension extends Extension {
  constructor (provider, type) {
    super()
    this._provider = provider
    this._type = type
  }

  myCursorBuilder (user) {
    const cursor = document.createElement('span')
    cursor.classList.add('ProseMirror-yjs-cursor-2')
    cursor.setAttribute('style', `border-color: ${user.color}`)
    const userDiv = document.createElement('div')
    userDiv.setAttribute('style', `
        background-color: ${user.color};
        font-family: SF Pro Display;
        padding: 3px 2px;
    `)
    userDiv.insertBefore(document.createTextNode(user.name), null)
    cursor.insertBefore(userDiv, null)
    return cursor
  }

  get name () {
    return 'collaboration'
  }

  get plugins () {
    return [
      ySyncPlugin(this._type),
      yCursorPlugin(this._provider.awareness, { cursorBuilder: this.myCursorBuilder }),
      yUndoPlugin(),
      keymap({
        'Mod-z': undo,
        'Mod-y': redo,
        'Mod-Shift-z': redo
      })
    ]
  }
}
