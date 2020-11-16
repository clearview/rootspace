import { Node } from 'tiptap'

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
        textAlign: {
          default: 'left'
        }
      },
      parseDOM: [{
        tag: 'p',
        getAttrs: value => ({ textAlign: value })
      }],
      toDOM: (node) => ['p', { style: `text-align: ${node.attrs.textAlign};` }, 0]
    }
  }

  commands ({ type }) {
    return attrs => (state, dispatch) => {
      const tr = state.tr
      const {
        $from
      } = state.selection
      const toParagraph = $from.before($from.depth)
      tr.setNodeMarkup(toParagraph, type, attrs)
      dispatch(tr)
    }
  }
}
