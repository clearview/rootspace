import { Mark } from 'tiptap'
import { alwaysToggleMark } from '@/views/Novadoc/TextColor'

export default class BgColor extends Mark {
  get name () {
    return 'bg_color'
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
          tag: 'span.novadoc-bg-color',
          getAttrs: node => {
            return {
              color: node.getAttribute('data-bg-color')
            }
          }
        }
      ],
      toDOM: (node) => ['span', {
        class: 'novadoc-bg-color',
        style: 'background: ' + node.attrs.color,
        'data-bg-color': node.attrs.color
      }, 0]
    }
  }

  commands ({ type }) {
    return (attr) => {
      return alwaysToggleMark(type, attr)
    }
  }
}
