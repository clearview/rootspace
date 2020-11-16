import { Plugin } from 'prosemirror-state'
import { Extension } from 'tiptap'
import { Decoration, DecorationSet } from 'prosemirror-view'

import {
  addColumnAfter,
  deleteColumn,
  addRowAfter,
  deleteRow,
  mergeCells,
  deleteTable
} from 'prosemirror-tables'

function createButton (text, cls, action) {
  const btn = document.createElement('button')
  btn.setAttribute('type', 'button')
  btn.innerHTML = text
  btn.classList.add(cls)
  btn.addEventListener('click', action)
  return btn
}

export default class TableMenu extends Extension {
  get name () {
    return 'table_menu'
  }

  get plugins () {
    return [
      new Plugin({
        state: {
          init () { return DecorationSet.empty },
          apply: (tr, set) => {
            set = set.map(tr.mapping, tr.doc)
            const sel = tr.selection
            let tablePos = null
            for (let i = sel.$from.depth; i > 0; i--) {
              const node = sel.$from.node(i)
              if (node.type.name === 'table') {
                tablePos = sel.$from.before(i) + 1
              }
            }
            if (tablePos) {
              // Adjust decoration positions to changes made by the transaction
              // See if the transaction adds or removes any placeholders
              const widget = document.createElement('div')
              widget.classList.add('novadoc-table-menu')
              widget.appendChild(createButton('+Row', 'novadoc-table-menu-button', () => {
                addRowAfter(this.editor.view.state, this.editor.view.dispatch)
              }))
              widget.appendChild(createButton('+Col', 'novadoc-table-menu-button', () => {
                addColumnAfter(this.editor.view.state, this.editor.view.dispatch)
              }))
              widget.appendChild(createButton('Merge', 'novadoc-table-menu-button', () => {
                mergeCells(this.editor.view.state, this.editor.view.dispatch)
              }))
              widget.appendChild(createButton('-Col', 'novadoc-table-menu-button', () => {
                deleteColumn(this.editor.view.state, this.editor.view.dispatch)
              }))
              widget.appendChild(createButton('-Row', 'novadoc-table-menu-button', () => {
                deleteRow(this.editor.view.state, this.editor.view.dispatch)
              }))
              widget.appendChild(createButton('Delete', 'novadoc-table-menu-button', () => {
                deleteTable(this.editor.view.state, this.editor.view.dispatch)
              }))
              const deco = Decoration.widget(tablePos, widget, {
                id: 't' + tablePos
              })
              if (set.find(tablePos).length === 0) {
                set = set.add(tr.doc, [deco])
              }
            } else {
              const remove = set.find(null, null)
              set = set.remove(tr.doc, remove)
              return DecorationSet.empty
            }
            return set
          }
        },
        props: {
          decorations (state) {
            return this.getState(state)
          }
        }
      })
    ]
  }
}
