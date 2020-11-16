import { Node } from 'tiptap'

export default class Divider extends Node {
  get name () {
    return 'divider'
  }

  get schema () {
    return {
      group: 'block',
      parseDOM: [{
        tag: 'hr'
      }],
      toDOM: () => ['hr', { class: 'novadoc-divider' }]
    }
  }

  commands ({ type }) {
    return () => (state, dispatch) => dispatch(state.tr.replaceSelectionWith(type.create()))
  }
}
