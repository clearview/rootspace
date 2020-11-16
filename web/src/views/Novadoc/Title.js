import { Node } from 'tiptap'

export default class Title extends Node {
  get name () {
    return 'title'
  }

  get schema () {
    return {
      content: 'text*',
      parseDOM: [{
        tag: 'h1'
      }],
      toDOM: () => ['h1', { class: 'novadoc-title' }, 0]
    }
  }
}
