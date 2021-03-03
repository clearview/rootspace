import { Extension, Plugin } from 'tiptap'
import { joinUp } from 'tiptap-commands'

const plugins = [
  new Plugin({
    props: {
      handleKeyDown (view, event) {
        if (event.key === 'Tab' && !event.shiftKey) {
          const sel = view.state.selection
          const currentList = sel.$from.node(sel.$from.depth - 1)
          const currentListParent = sel.$from.node(sel.$from.depth - 2)
          // We want to merge only if its the first child
          if (
            currentList.type.name === 'list_item' &&
            (currentListParent.type.name === 'ordered_list' || currentListParent.type.name === 'bullet_list') &&
            currentListParent.childCount === 1
          ) {
            joinUp(view.state, view.dispatch)
          }
        }
      }
    }
  })
]
export default class ListMerger extends Extension {
  get name () {
    return 'list_merger'
  }

  get plugins () {
    return plugins
  }
}
