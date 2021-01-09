import { Plugin, Node, TextSelection } from 'tiptap'
import { Decoration, DecorationSet } from 'prosemirror-view'
import ReferenceList from './ReferenceList'
import Vue from 'vue'
import ReferenceView from '@/views/Novadoc/Reference/ReferenceView'
import router from '@/router'

export default class Reference extends Node {
  constructor (trigger = '#', fetchReferences) {
    super()
    this.trigger = trigger
    this.fetchReferences = fetchReferences
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this
    this.plugin = new Plugin({
      state: {
        init () {
          return DecorationSet.empty
        },
        apply (tr, set) {
          set = set.map(tr.mapping, tr.doc)
          const action = tr.getMeta(this)
          if (action && action.show) {
            const type = _this.editor.schema.nodes.reference
            const deco = Decoration.widget(action.show.pos, (view, getPos) => {
              const coords = view.coordsAtPos(getPos())
              const container = document.createElement('div')
              const referenceList = new Vue({
                render: h => h(ReferenceList, {
                  props: {
                    references: action.show.references,
                    coords: coords
                  },
                  on: {
                    cancel: () => {
                      const tr = view.state.tr
                      view.focus()
                      view.dispatch(
                        tr.setMeta(this, {
                          close: {}
                        })
                          .setSelection(TextSelection.create(tr.doc, action.show.pos))
                      )
                    },
                    confirm: (reference) => {
                      const tr = view.state.tr
                      view.dispatch(
                        tr.setMeta(this, {
                          close: {}
                        })
                          .setSelection(TextSelection.create(tr.doc, action.show.pos))
                          .replaceWith(action.show.fromToolbar ? action.show.pos : action.show.pos - 1, action.show.pos, type.create({
                            referenceId: reference.id,
                            referenceContentId: reference.contentId,
                            referenceDisplay: `${reference.title}`,
                            referenceType: reference.type,
                            referenceNovadoc: reference.config && reference.config.novaDoc === true
                          }))
                      )
                      view.focus()
                    }
                  }
                })
              }).$mount(container)
              return referenceList.$el
            }, { id: 'suggestion' })
            set = set.add(tr.doc, [deco])
            return set
          } else if (action && action.close) {
            return DecorationSet.empty
          }
          if (tr.selectionSet) {
            const before = tr.selection.$from.nodeBefore
            if (before && before.isInline && before.text !== '@') {
              return DecorationSet.empty
            }
          }
          return set
        }
      },
      props: {
        decorations (state) {
          return this.getState(state)
        },
        nodeViews: {
          reference (node) {
            const container = document.createElement('div')
            const vue = new Vue({
              router: router,
              render: h => h(ReferenceView, {
                props: {
                  type: node.attrs.referenceType,
                  label: node.attrs.referenceDisplay,
                  id: node.attrs.referenceId,
                  contentId: node.attrs.referenceContentId,
                  novadoc: node.attrs.referenceNovadoc
                }
              })
            }).$mount(container)
            return {
              dom: vue.$el
            }
          }
        },
        handleKeyDown (view, event) {
          const action = view.state.tr.getMeta(this)
          if (action && action.show) {
            // already showing
            return false
          }
          if (event.key === trigger) {
            if (fetchReferences) {
              fetchReferences().then(references => {
                view.dispatch(
                  view.state.tr.setMeta(this, {
                    show: {
                      pos: view.state.tr.selection.from,
                      references: references
                    }
                  })
                )
              })
            }
          } else if (event.key === ' ' || event.key === 'Enter') {
            view.dispatch(
              view.state.tr.setMeta(this, {
                close: {}
              })
            )
          }
        }
      }
    })
  }

  get name () {
    return 'reference'
  }

  get schema () {
    return {
      group: 'inline',
      inline: true,
      atom: true,
      defining: true,
      draggable: false,
      attrs: {
        referenceId: {
          default: ''
        },
        referenceContentId: {
          default: ''
        },
        referenceDisplay: {
          default: ''
        },
        referenceType: {
          default: ''
        },
        referenceNovadoc: {
          default: ''
        }
      },
      parseDOM: [{
        tag: 'span.novadoc-reference',
        getAttrs: node => (
          {
            referenceId: node.getAttribute('data-reference-id'),
            referenceContentId: node.getAttribute('data-reference-id'),
            referenceDisplay: node.getAttribute('data-reference-display'),
            referenceType: node.getAttribute('data-reference-type'),
            referenceNovadoc: node.getAttribute('data-reference-novadoc')
          }
        )
      }],
      toDOM: (node) => {
        const span = document.createElement('span')
        span.setAttribute('data-reference-id', node.attrs.referenceId)
        span.setAttribute('data-reference-content-id', node.attrs.referenceContentId)
        span.setAttribute('data-reference-display', node.attrs.referenceDisplay)
        span.setAttribute('data-reference-type', node.attrs.referenceType)
        span.setAttribute('data-reference-novadoc', node.attrs.referenceNovadoc)
        span.classList.add('novadoc-reference')
        span.innerText = node.attrs.referenceDisplay
        return span
      }
    }
  }

  commands () {
    const { fetchReferences } = this
    return {
      showReference: () => (state, dispatch) => {
        const action = state.tr.getMeta(this.plugin)
        if (action && action.show) {
          // already showing
          return false
        }
        if (fetchReferences) {
          fetchReferences().then(references => {
            dispatch(
              state.tr.setMeta(this.plugin, {
                show: {
                  pos: state.tr.selection.from,
                  references: references,
                  fromToolbar: true
                }
              })
            )
          })
        }
      }
    }
  }

  get plugins () {
    return [
      this.plugin
    ]
  }
}
