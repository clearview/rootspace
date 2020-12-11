import { Node, Plugin, TextSelection } from 'tiptap'

export default class Paragraph extends Node {
  get name () {
    return 'paragraph'
  }

  get schema () {
    return {
      content: 'inline*',
      group: 'block',
      draggable: false,
      attrs: {
        align: {
          default: 'left'
        },
        level: {
          default: 0
        }
      },
      parseDOM: [
        {
          tag: 'p.novadoc-paragraph',
          getAttrs: node => ({
            align: node.style.textAlign,
            level: 0
          })
        },
        {
          tag: 'h1.novadoc-paragraph',
          getAttrs: node => ({
            align: node.style.textAlign,
            level: 1
          })
        },
        {
          tag: 'h2.novadoc-paragraph',
          getAttrs: node => ({
            align: node.style.textAlign,
            level: 2
          })
        },
        {
          tag: 'h3.novadoc-paragraph',
          getAttrs: node => ({
            align: node.style.textAlign,
            level: 3
          })
        }
      ],
      toDOM: (node) => {
        if (node.attrs.level === 0) {
          return ['p', {
            class: 'novadoc-paragraph',
            style: `text-align: ${node.attrs.align};`
          }, 0]
        } else if (node.attrs.level === 1) {
          return ['h1', {
            class: 'novadoc-paragraph',
            style: `text-align: ${node.attrs.align};`
          }, 0]
        } else if (node.attrs.level === 2) {
          return ['h2', {
            class: 'novadoc-paragraph',
            style: `text-align: ${node.attrs.align};`
          }, 0]
        } else if (node.attrs.level === 3) {
          return ['h3', {
            class: 'novadoc-paragraph',
            style: `text-align: ${node.attrs.align};`
          }, 0]
        }
      }
    }
  }

  commands ({ type }) {
    return attrs => (state, dispatch) => {
      const tr = state.tr
      const {
        $from
      } = state.selection
      const toParagraph = $from.before($from.depth)
      const existingAttr = $from.node($from.depth).attrs ? $from.node($from.depth).attrs : {}
      tr.setNodeMarkup(toParagraph, type, { ...existingAttr, ...attrs })
      dispatch(tr)
    }
  }

  get plugins () {
    return [
      new Plugin({
        props: {
          handleKeyDown (view, evt) {
            if (evt.key === 'Enter') {
              const tr = view.state.tr
              const sel = view.state.selection
              const node = sel.$from.node(sel.$from.depth)
              if (node.type.name === 'paragraph' && node.attrs.level > 0) {
                const before = sel.$from.before(sel.$from.depth)
                const parentOffset = sel.$from.parentOffset
                if (parentOffset === 0) {
                  view.dispatch(
                    tr.insert(before, node.type.create({ level: 0 }))
                      .setSelection(TextSelection.create(tr.doc, before + 1)) // +1 to enter the paragraph
                  )
                  return true
                }
              }
            }
          }
        }
      })
    ]
  }
}
