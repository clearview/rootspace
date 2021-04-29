import { Extension, Plugin } from 'tiptap'

const plugins = [
  new Plugin({
    props: {
      handleKeyDown (view: any, event: any) {
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
