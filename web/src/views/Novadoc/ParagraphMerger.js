import { Extension } from 'tiptap'

export default class ParagraphMerger extends Extension {
  get name () {
    return 'paragraph_merger'
  }

  commands ({ schema }) {
    return ({ command }) => (state, dispatch) => {
      const tr = state.tr
      if (state.selection.empty) {
        command(state, dispatch)
        return
      }
      const {
        $from,
        $to
      } = state.selection
      const fragments = tr.doc.cut($from.pos, $to.pos)
      const text = fragments.content.content.reduce((prev, next) => prev + '\n' + next.textContent, '')
      dispatch(tr.replaceSelectionWith(schema.nodes.code_block.create(null, schema.text(text.trim()))))
    }
  }
}
