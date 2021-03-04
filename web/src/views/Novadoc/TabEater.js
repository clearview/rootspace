import { Extension, Plugin } from 'tiptap'
import { joinUp } from 'tiptap-commands'

const plugins = [
  new Plugin({
    props: {
      handleKeyDown (view, event) {
        if (event.key === 'Tab') {
          event.preventDefault()
          return false
        }
      }
    }
  })
]
export default class TabEater extends Extension {
  get name () {
    return 'tab_eater'
  }

  get plugins () {
    return plugins
  }
}
