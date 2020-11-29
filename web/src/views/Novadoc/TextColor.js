import { Mark } from 'tiptap'

export function alwaysToggleMark (markType, attrs) {
  return function (state, dispatch) {
    const ref = state.selection
    const empty = ref.empty
    const $cursor = ref.$cursor
    const ranges = ref.ranges
    if ((empty && !$cursor)) {
      return false
    }
    if (dispatch) {
      if ($cursor) {
        if (markType.isInSet(state.storedMarks || $cursor.marks())) {
          dispatch(state.tr.removeStoredMark(markType).addStoredMark(markType.create(attrs)))
        } else {
          dispatch(state.tr.addStoredMark(markType.create(attrs)))
        }
      } else {
        let has = false
        const tr = state.tr
        for (let i = 0; !has && i < ranges.length; i++) {
          const ref$1 = ranges[i]
          const $from = ref$1.$from
          const $to = ref$1.$to
          has = state.doc.rangeHasMark($from.pos, $to.pos, markType)
        }
        for (let i$1 = 0; i$1 < ranges.length; i$1++) {
          const ref$2 = ranges[i$1]
          const $from$1 = ref$2.$from
          const $to$1 = ref$2.$to
          if (has) {
            tr.removeMark($from$1.pos, $to$1.pos, markType)
              .addMark($from$1.pos, $to$1.pos, markType.create(attrs))
          } else {
            tr.addMark($from$1.pos, $to$1.pos, markType.create(attrs))
          }
        }
        dispatch(tr.scrollIntoView())
      }
    }
    return true
  }
}

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
      return alwaysToggleMark(type, attr)
    }
  }
}
