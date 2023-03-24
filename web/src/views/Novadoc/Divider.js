import { Node } from 'tiptap'
import DividerView from '@/views/Novadoc/Views/DividerView'

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

  get view () {
    return DividerView
  }
}
