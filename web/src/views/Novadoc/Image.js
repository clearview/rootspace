import { Node, Plugin } from 'tiptap'
import { deleteSelection } from 'tiptap-commands'
import { Decoration, DecorationSet } from 'prosemirror-view'
import Vue from 'vue'
import ImagePlaceholder from '@/views/Novadoc/ImagePlaceholder'
import api from '@/utils/api'
import ImageView from '@/views/Novadoc/Views/ImageView'

const imagePlugin = new Plugin({
  state: {
    init () {
      return DecorationSet.empty
    },
    apply (tr, set) {
      // Adjust decoration positions to changes made by the transaction
      set = set.map(tr.mapping, tr.doc)
      // See if the transaction adds or removes any placeholders
      const action = tr.getMeta(this)
      if (action && action.add) {
        const widget = document.createElement('div')
        const vue = new Vue({ render: (h) => h(ImagePlaceholder, { props: { src: action.add.placeholder } }) }).$mount(widget)
        const el = vue.$el
        const deco = Decoration.widget(action.add.pos, el, { id: action.add.id })
        set = set.add(tr.doc, [deco])
      } else if (action && action.remove) {
        set = set.remove(set.find(null, null, spec => spec.id === action.remove.id))
      }
      return set
    }
  },
  props: {
    decorations (state) {
      return this.getState(state)
    }
  }
})

function findPlaceholder (state, id) {
  const decos = imagePlugin.getState(state)
  const found = decos.find(null, null, spec => spec.id === id)
  return found.length ? found[0].from : null
}

export default class Image extends Node {
  get name () {
    return 'image'
  }

  get schema () {
    return {
      group: 'block',
      atom: true,
      defining: true,
      draggable: true,
      attrs: {
        src: {
          default: ''
        },
        align: {
          default: 'center'
        },
        size: {
          default: 'medium'
        },
        alt: {
          default: 'image'
        }
      },
      parseDOM: [{
        tag: 'img',
        getAttrs: node => (
          {
            src: node.getAttribute('src'),
            alt: node.getAttribute('alt'),
            align: node.getAttribute('data-align'),
            size: node.getAttribute('data-size')
          })
      }],
      toDOM: (node) => ['img', {
        class: `novadoc-image align-${node.attrs.align} size-${node.attrs.size}`,
        alt: node.attrs.alt,
        src: node.attrs.src
      }]
    }
  }

  get plugins () {
    return [
      imagePlugin
    ]
  }

  get view () {
    return ImageView
  }

  commands ({ type }) {
    const view = this.editor.view
    return ({ docId, spaceId, remove }) => (state, dispatch) => {
      if (remove) {
        return deleteSelection(state, dispatch)
      }
      let filePicker = document.querySelector('input[type=file][data-novadoc-file]')
      if (!filePicker) {
        filePicker = document.createElement('input')
        filePicker.style.display = 'none'
        filePicker.setAttribute('type', 'file')
        filePicker.setAttribute('data-novadoc-file', ' true')
        document.body.appendChild(filePicker)
        filePicker.addEventListener('change', () => {
          const file = filePicker.files.item(0)
          if (file) {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('entityId', docId)
            formData.append('entity', 'Doc')
            formData.append('type', 'docContent')
            formData.append('spaceId', spaceId)

            const fileReader = new FileReader()
            fileReader.addEventListener('load', async () => {
              const result = fileReader.result

              const id = file.name + '_' + file.size
              const tr = view.state.tr
              if (!tr.selection.empty) {
                tr.deleteSelection()
              }
              tr.setMeta(imagePlugin, {
                add: {
                  id,
                  pos: tr.selection.from,
                  placeholder: result
                }
              })
              view.dispatch(tr)

              const uploadRes = await api.post('/uploads', formData)
              const fileUrl = uploadRes.data.data.location
              const pos = findPlaceholder(view.state, id)
              if (pos === null) return

              view.dispatch(
                view.state.tr.replaceWith(pos, pos, type.create({
                  src: fileUrl
                }))
                  .setMeta(imagePlugin, { remove: { id } }))
            })

            fileReader.readAsDataURL(file)
          }
        })
      }

      filePicker.click()
    }
  }
}
