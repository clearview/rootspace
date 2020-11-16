import { Plugin, Node, TextSelection } from 'tiptap'
import { Decoration, DecorationSet } from 'prosemirror-view'
import UserList from '@/views/Novadoc/Mentions/UserList'
import Vue from 'vue'

export default class Mention extends Node {
  constructor (trigger = '@', fetchUsers) {
    super()
    this.trigger = trigger
    this.fetchUsers = fetchUsers
  }

  get name () {
    return 'mention'
  }

  get schema () {
    return {
      group: 'inline',
      inline: true,
      atom: true,
      defining: true,
      draggable: false,
      attrs: {
        mentionId: {
          default: ''
        },
        mentionDisplay: {
          default: ''
        }
      },
      parseDOM: [{
        tag: 'span.novadoc-mention',
        getAttrs: node => (
          {
            mentionId: node.getAttribute('data-mention-id'),
            mentionDisplay: node.getAttribute('data-mention-display')
          }
        )
      }],
      toDOM: (node) => {
        const span = document.createElement('span')
        span.setAttribute('data-mention-id', node.attrs.mentionId)
        span.setAttribute('data-mention-display', node.attrs.mentionDisplay)
        span.classList.add('novadoc-mention')
        span.innerText = node.attrs.mentionDisplay
        return span
      }
    }
  }

  get plugins () {
    const { fetchUsers, trigger } = this
    const type = this.editor.schema.nodes.mention
    return [
      new Plugin({
        state: {
          init () {
            return DecorationSet.empty
          },
          apply (tr, set) {
            set = set.map(tr.mapping, tr.doc)
            const action = tr.getMeta(this)
            if (action && action.show) {
              const deco = Decoration.widget(action.show.pos, (view, getPos) => {
                const coords = view.coordsAtPos(getPos())
                const container = document.createElement('div')
                const userList = new Vue({
                  render: h => h(UserList, {
                    props: {
                      users: action.show.users,
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
                      confirm: (user) => {
                        const tr = view.state.tr
                        view.dispatch(
                          tr.setMeta(this, {
                            close: {}
                          })
                            .setSelection(TextSelection.create(tr.doc, action.show.pos))
                            .replaceWith(action.show.pos - 1, action.show.pos, type.create({
                              mentionId: user.id,
                              mentionDisplay: `${user.firstName} ${user.lastName}`
                            }))
                        )
                        view.focus()
                      }
                    }
                  })
                }).$mount(container)
                return userList.$el
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
          handleKeyDown (view, event) {
            const action = view.state.tr.getMeta(this)
            if (action && action.show) {
              // already showing
              return false
            }
            if (event.key === trigger) {
              if (fetchUsers) {
                fetchUsers().then(users => {
                  view.dispatch(
                    view.state.tr.setMeta(this, {
                      show: {
                        pos: view.state.tr.selection.from,
                        users: users
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
    ]
  }
}
