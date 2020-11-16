import { Mark } from 'tiptap'
import { toggleMark } from 'tiptap-commands'

export default class TextColor extends Mark {
  get name () {
    return 'text_color'
  }

  get schema () {
    return {
      attrs: {
        color: {
          default: '#000'
        }
      },
      parseDOM: [
        {
          tag: 'span.novadoc-text-color',
          getAttrs: node => {
            return {
              color: node.getAttribute('data-text-color')
            }
          }
        }
      ],
      toDOM: (node) => ['span', {
        class: 'novadoc-text-color',
        style: 'color: ' + node.attrs.color,
        'data-text-color': node.attrs.color
      }, 0]
    }
  }

  commands ({ type }) {
    return (attr) => {
      return toggleMark(type, attr)
    }
  }
}
