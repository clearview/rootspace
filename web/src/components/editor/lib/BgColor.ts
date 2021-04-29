import { Mark } from 'tiptap'
import { alwaysToggleMark } from './TextColor'

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
          getAttrs: (node: any) => {
            return {
              color: node.getAttribute('data-bg-color')
            }
          }
        }
      ],
      toDOM: (node: any) => ['span', {
        class: 'novadoc-bg-color',
        style: 'background: ' + node.attrs.color,
        'data-bg-color': node.attrs.color
      }, 0]
    }
  }

  commands ({ type }: any) {
    return (attr: any) => {
      return alwaysToggleMark(type, attr)
    }
  }
}
