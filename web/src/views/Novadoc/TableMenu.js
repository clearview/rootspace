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
import NovadocTableMenu from '@/views/Novadoc/Menu/NovadocTableMenu'

import Vue from 'vue'

export default class TableMenu extends Extension {
  get name () {
    return 'table_menu'
  }

  get plugins () {
    const editable = this.editor.options.editable
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
              if (node && node.type.name === 'table') {
                tablePos = sel.$from.before(i) + 1
              }
            }
            if (tablePos && editable) {
              // Adjust decoration positions to changes made by the transaction
              // See if the transaction adds or removes any placeholders
              const widget = document.createElement('div')
              const vue = new Vue({
                render: (h) => h(NovadocTableMenu, {
                  props: {
                    editor: this.editor,
                    view: this.view,
                    api: {
                      addRowAfter: () => addRowAfter(this.editor.view.state, this.editor.view.dispatch),
                      addColumnAfter: () => addColumnAfter(this.editor.view.state, this.editor.view.dispatch),
                      mergeCells: () => mergeCells(this.editor.view.state, this.editor.view.dispatch),
                      deleteColumn: () => deleteColumn(this.editor.view.state, this.editor.view.dispatch),
                      deleteRow: () => deleteRow(this.editor.view.state, this.editor.view.dispatch),
                      deleteTable: () => deleteTable(this.editor.view.state, this.editor.view.dispatch)
                    }
                  }
                })
              }).$mount(widget)
              const deco = Decoration.widget(tablePos, vue.$el, {
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
