<template>
  <div class="page" ref="page">
    <header class="page-header">
      <editor-menu-bar ref="menuBar" :editor="editor" v-slot="{ commands, isActive, getMarkAttrs, getNodeAttrs }">
        <div class="editor-menu">
          <div class="menubar">
            <MenuGroup value="Normal Text">
              <template #default>
                {{ getTextDisplayType(isActive) }}
              </template>
              <template #options="{select, hide}">
                  <MenuGroupOption @click="select('Normal Text');hide();commands.paragraph()">
                    <template #icon>
                      Tt
                    </template>
                    <template #label>
                      Normal Text
                    </template>
                  </MenuGroupOption>
                <MenuGroupOption @click="select('Heading 1');hide();commands.heading({level: 1})">
                  <template #icon>
                    H1
                  </template>
                  <template #label>
                    Heading 1
                  </template>
                </MenuGroupOption>
                <MenuGroupOption @click="select('Heading 2');hide();commands.heading({level: 2})">
                  <template #icon>
                    H2
                  </template>
                  <template #label>
                    Heading 2
                  </template>
                </MenuGroupOption>
                <MenuGroupOption @click="select('Heading 3');hide();commands.heading({level: 3})">
                  <template #icon>
                    H3
                  </template>
                  <template #label>
                    Heading 3
                  </template>
                </MenuGroupOption>
                <MenuGroupOption @click="select('Heading 4');hide();commands.heading({level: 4})">
                  <template #icon>
                    H4
                  </template>
                  <template #label>
                    Heading 4
                  </template>
                </MenuGroupOption>
              </template>
            </MenuGroup>
            <div class="menu-separator"></div>
            <button class="menu" :class="{ 'active': isActive.bold() }" @click="commands.bold">
              <BoldIcon size="16"></BoldIcon>
            </button>
            <button class="menu" :class="{ 'active': isActive.italic() }" @click="commands.italic">
              <ItalicIcon size="16"></ItalicIcon>
            </button>
            <button class="menu" :class="{ 'active': isActive.underline() }" @click="commands.underline">
              <UnderlineIcon size="16"></UnderlineIcon>
            </button>
            <button class="menu" :class="{ 'active': isActive.strike() }" @click="commands.strike">
              <span style="text-decoration: line-through;">ST</span>
            </button>
            <button class="menu" :class="{ 'active': isActive.code() }" @click="commands.code">
              <TerminalIcon size="16"></TerminalIcon>
            </button>
            <div class="menu-separator"></div>
            <MenuGroup value="Left">
              <template #default>
                <component :is="getTextAlignmentIcon(getNodeAttrs('paragraph').textAlign)" size="14"></component>
              </template>
              <template #options="{select, hide}">
                <MenuGroupOption @click="select('Left');hide();commands.paragraph({textAlign: 'left'})">
                  <template #icon>
                    <AlignLeftIcon size="16"></AlignLeftIcon>
                  </template>
                  <template #label>
                    Left
                  </template>
                </MenuGroupOption>
                <MenuGroupOption @click="select('Center');hide();commands.paragraph({textAlign: 'center'})">
                  <template #icon>
                    <AlignCenterIcon size="16"></AlignCenterIcon>
                  </template>
                  <template #label>
                    Center
                  </template>
                </MenuGroupOption>
                <MenuGroupOption @click="select('Right');hide();commands.paragraph({textAlign: 'right'})">
                  <template #icon>
                    <AlignRightIcon size="16"></AlignRightIcon>
                  </template>
                  <template #label>
                    Right
                  </template>
                </MenuGroupOption>
                <MenuGroupOption @click="select('Justify');hide();commands.paragraph({textAlign: 'justify'})">
                  <template #icon>
                    <AlignJustifyIcon size="16"></AlignJustifyIcon>
                  </template>
                  <template #label>
                    Justify
                  </template>
                </MenuGroupOption>
              </template>
            </MenuGroup>
            <div class="menu-separator"></div>
            <MenuGroup value="#000">
              <template #default>
                <div class="text-color" :style="{
                  color: getMarkAttrs('text_color') ? getMarkAttrs('text_color').color : '#000',
                  background: getMarkAttrs('text_color') && getMarkAttrs('text_color').color === '#fff' ? '#333' : 'transparent'
                }">Tt</div>
              </template>
              <template #options="{select, hide}">
                <div class="color-blocks">
                  <div v-for="color in colors" :key="color" class="color-block" :style="{background: color}" @click="select(color);hide();commands.text_color({color: color})"></div>
                </div>
              </template>
            </MenuGroup>
            <MenuGroup value="#000">
              <template #default>
                <div class="bg-color" :style="{background: getMarkAttrs('bg_color') ? getMarkAttrs('bg_color').color : '#fff'}">Bg</div>
              </template>
              <template #options="{select, hide}">
                <div class="color-blocks">
                  <div v-for="color in colors" :key="color" class="color-block" :style="{background: color}" @click="select(color);hide();commands.bg_color({color: color})"></div>
                </div>
              </template>
            </MenuGroup>
            <div class="menu-separator"></div>
            <MenuGroup value="Left">
              <template #default>
                <component :is="getListTypeIcon(isActive)" size="14"></component>
              </template>
              <template #options="{select, hide}">
                <MenuGroupOption @click="select('Left');hide();commands.bullet_list()">
                  <template #icon>
                    <ListIcon size="16"></ListIcon>
                  </template>
                  <template #label>
                    Bullet List
                  </template>
                </MenuGroupOption>
                <MenuGroupOption @click="select('Left');hide();commands.ordered_list()">
                  <template #icon>
                    <ListIcon size="16"></ListIcon>
                  </template>
                  <template #label>
                    Ordered List
                  </template>
                </MenuGroupOption>
                <MenuGroupOption @click="select('Left');hide();commands.todo_list()">
                  <template #icon>
                    <CheckSquareIcon size="16"></CheckSquareIcon>
                  </template>
                  <template #label>
                    Todo List
                  </template>
                </MenuGroupOption>
              </template>
            </MenuGroup>
            <div class="menu-separator"></div>
            <button class="menu" :class="{ 'active': isActive.image() }"
                    @click="commands.image({docId: id, spaceId: activeSpace.id})">
              <ImageIcon size="16"></ImageIcon>
            </button>
            <button class="menu" :class="{ 'active': isActive.link() }"
                    @click="isActive.link() ? commands.link({href: null}) : showLinkForm(getMarkAttrs('link'))">
              <LinkIcon size="16"></LinkIcon>
            </button>
            <button class="menu" :class="{ 'active': isActive.divider() }" @click="commands.divider">
              <MinusIcon size="16"></MinusIcon>
            </button>
            <button class="menu" :class="{ 'active': isActive.blockquote() }" @click="commands.blockquote">
              <MessageCircleIcon size="16"></MessageCircleIcon>
            </button>
            <button class="menu" :class="{ 'active': isActive.code_block() }" @click="commands.code_block">
              <CodeIcon size="16"></CodeIcon>
            </button>
            <div class="menu-separator"></div>
            <button
              class="menubar__button"
              @click="commands.createTable({rowsCount: 3, colsCount: 3, withHeaderRow: false })"
            >
              <ColumnsIcon size="16"/>
            </button>
            <div class="menu-separator"></div>
            <button class="menu" @click="commands.undo">
              <ChevronLeftIcon size="16"></ChevronLeftIcon>
            </button>
            <button class="menu" @click="commands.redo">
              <ChevronRightIcon size="16"></ChevronRightIcon>
            </button>
            <button class="menu" v-if="isActive.link()" @click="visitLink(getMarkAttrs('link'))">
              Open Link
            </button>
          </div>
          <div class="menu-options">
            <Popover :z-index="1001" :with-close="false" position="bottom-start">
              <template #default="{ hide }">
                <div class="action-line" @click="hide();toggleReadOnly()">
                  <v-icon name="lock"></v-icon>
                  <div class="action-line-text" v-if="readOnly">
                    Make Editable
                  </div>
                  <div class="action-line-text" v-else>
                    Make Read-only
                  </div>
                </div>
                <div class="action-line" @click="hide();showHistory()">
                  <v-icon name="history" viewbox="20"></v-icon>
                  <div class="action-line-text">
                    History
                  </div>
                </div>
                <div class="action-separator"></div>
                <div class="action-line danger" @click="hide();deleteNovadoc()">
                  <v-icon name="trash"></v-icon>
                  <div class="action-line-text">
                    Delete
                  </div>
                </div>
              </template>
              <template #trigger="{ visible }">
                <button class="menu-btn btn btn-link" :class="{'btn-link-primary': visible}">
                  <v-icon name="ellipsis" viewbox="20" size="1.25rem"/>
                </button>
              </template>
            </Popover>
          </div>
        </div>
      </editor-menu-bar>
    </header>
    <editor-menu-bubble :editor="editor" @hide="hideLinkForm" v-slot="{ commands, isActive, getMarkAttrs, menu }">
      <div
        class="bubble"
        :class="{ 'is-active': menu.isActive && !isActive.mention() && !isActive.reference() && !isActive.title() && !readOnly }"
        :style="`left: ${menu.left}px; bottom: ${menu.bottom}px;`"
      >
        <div class="link-form" v-if="linkMarking.active">
          <div class="bubble-form">
            <input type="url" class="bubble-input" v-model="linkMarking.href" placeholder="https://" ref="linkInput"
                   @keydown.esc="hideLinkForm"
                   @keypress.enter="setLinkData(commands.link, linkMarking.href)">
            <button class="bubble-form-no" @click="hideLinkForm">
              <XIcon size="16"></XIcon>
            </button>
            <button class="bubble-form-yes" @click="setLinkData(commands.link, linkMarking.href)">
              <CheckIcon size="16"></CheckIcon>
            </button>
          </div>
        </div>
        <template v-if="isActive.image()">
          <button class="menu" @click="commands.image({remove: true})">
            <TrashIcon size="16"></TrashIcon>
          </button>
        </template>
        <template v-if="!linkMarking.active && !isActive.image() && !isActive.divider()">
          <button class="menu" :class="{ 'active': isActive.bold() }" @click="commands.bold">
            <BoldIcon size="16"></BoldIcon>
          </button>
          <button class="menu" :class="{ 'active': isActive.italic() }" @click="commands.italic">
            <ItalicIcon size="16"></ItalicIcon>
          </button>
          <button class="menu" :class="{ 'active': isActive.underline() }" @click="commands.underline">
            <UnderlineIcon size="16"></UnderlineIcon>
          </button>
          <button class="menu" :class="{ 'active': isActive.strike() }" @click="commands.strike">
            <span style="text-decoration: line-through;">ST</span>
          </button>
          <button class="menu" :class="{ 'active': isActive.code() }" @click="commands.code">
            <TerminalIcon size="16"></TerminalIcon>
          </button>
          <div class="menu-separator"></div>
          <button class="menu" :class="{ 'active': isActive.link() }"
                  @click="isActive.link() ? commands.link({href: null}) : showLinkForm(getMarkAttrs('link'))">
            <LinkIcon size="16"></LinkIcon>
          </button>
          <div class="menu-separator"></div>
        </template>
      </div>
    </editor-menu-bubble>
    <div class="page-editor" @click.self="focusToEditor">
      <EditorContent :editor="editor"></EditorContent>
    </div>
    <div class="page-history" v-show="isHistoryVisible">
      <DocHistory ref="docHistory" :doc="doc" :preview="preview" :id="id" @close="closeHistory" @preview="showPreview" @restore="restore"></DocHistory>
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import api from '../utils/api'
import Popover from '@/components/Popover'
import { Editor, EditorContent, EditorMenuBar, EditorMenuBubble } from 'tiptap'
import {
  Blockquote,
  Bold,
  BulletList,
  Code,
  CodeBlockHighlight,
  Heading,
  History,
  Italic,
  Link,
  ListItem,
  OrderedList,
  Placeholder,
  Strike,
  Table,
  TableCell,
  TableHeader,
  TableRow, TodoItem, TodoList,
  TrailingNode,
  Underline
} from 'tiptap-extensions'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import bash from 'highlight.js/lib/languages/bash'
import ButtonSwitch from '@/components/ButtonSwitch'

import Novaschema from '@/views/Novadoc/Novaschema.js'
import Title from '@/views/Novadoc/Title.js'
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  CheckIcon, CheckSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CodeIcon,
  ColumnsIcon, ImageIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  MessageCircleIcon,
  MinusIcon,
  TerminalIcon,
  UnderlineIcon,
  TrashIcon,
  XIcon
} from 'vue-feather-icons'
import DocumentService from '@/services/document'
import SpaceMixin from '@/mixins/SpaceMixin'
import PageMixin from '@/mixins/PageMixin'
import Divider from '@/views/Novadoc/Divider'
import Paragraph from '@/views/Novadoc/Paragraph'
import TableMenu from '@/views/Novadoc/TableMenu'
import MenuGroup from '@/views/Novadoc/MenuGroup'
import MenuGroupOption from '@/views/Novadoc/MenuGroupOption'
import Image from '@/views/Novadoc/Image'
import Mention from '@/views/Novadoc/Mentions/Mention'
import Reference from '@/views/Novadoc/Reference/Reference'
import TextColor from '@/views/Novadoc/TextColor'
import BgColor from '@/views/Novadoc/BgColor'
import DocHistory from '@/views/Document/DocHistory'

export default {
  mixins: [SpaceMixin, PageMixin],
  components: {
    DocHistory,
    MenuGroupOption,
    MenuGroup,
    EditorContent,
    ButtonSwitch,
    EditorMenuBar,
    EditorMenuBubble,
    ChevronLeftIcon,
    ChevronRightIcon,
    BoldIcon,
    ColumnsIcon,
    ItalicIcon,
    LinkIcon,
    UnderlineIcon,
    CodeIcon,
    CheckSquareIcon,
    ListIcon,
    TrashIcon,
    AlignLeftIcon,
    AlignRightIcon,
    AlignCenterIcon,
    AlignJustifyIcon,
    MessageCircleIcon,
    XIcon,
    MinusIcon,
    CheckIcon,
    TerminalIcon,
    ImageIcon,
    Popover
  },
  data () {
    // const ydoc = new Y.Doc()
    // const provider = new WebsocketProvider('ws://localhost:4444', 'x' + id, ydoc)
    // const type = ydoc.getXmlFragment('prosemirror')
    return {
      provider: null,
      doc: null,
      preview: null,
      linkMarking: {
        active: false,
        href: null
      },
      readOnly: false,
      isHistoryVisible: false,
      editor: new Editor({
        editable: true,
        autoFocus: true,
        extensions: [
          new Novaschema(),
          new Mention('@', this.fetchUsers),
          new Reference('#', this.fetchReferences),
          new Title(),
          new Divider(),
          new Paragraph(),
          new TextColor(),
          new BgColor(),
          new Heading({
            level: [1, 2, 3, 4]
          }),
          new Bold(),
          new Blockquote(),
          new CodeBlockHighlight({
            languages: {
              javascript,
              typescript,
              bash
            }
          }),
          new Italic(),
          new Underline(),
          new Strike(),
          new Code(),
          new History(),
          new BulletList(),
          new ListItem(),
          new OrderedList(),
          new Image(),
          new TodoList(),
          new TodoItem({
            nested: true
          }),
          new Link({
            openOnClick: false
          }),
          new TrailingNode({
            node: 'paragraph',
            notAfter: ['paragraph']
          }),
          new Placeholder({
            emptyEditorClass: 'is-editor-empty',
            emptyNodeClass: 'is-empty',
            emptyNodeText: (node) => {
              if (node.type.name === 'title') {
                return 'Untitled'
              }
              if (this.editor && this.editor.state.doc.content && this.editor.state.doc.content.content.length > 2) {
                return ''
              }
              return 'Write something…'
            },
            showOnlyWhenEditable: false,
            showOnlyCurrent: false
          }),
          new Table({
            resizable: true
          }),
          new TableHeader(),
          new TableCell(),
          new TableRow(),
          new TableMenu()
          // new CollaborationExtension(provider, type)
        ],
        emptyDocument: {
          type: 'doc',
          content: [{
            type: 'title',
            content: ''
          }]
        }
      })
    }
  },
  beforeDestroy () {
    this.editor.destroy()
  },
  async mounted () {
    // await this.load()
    // await this.$store.dispatch('tree/fetch', { spaceId: this.activeSpace.id })
    // await this.activateSpace(this.activeSpace.id)
    const deb = debounce((json) => {
      this.save(json)
    }, 1000)
    this.editor.on('update', (api) => {
      const newTitle = api.getJSON().content.reduce((prev, next) => {
        if (next.type === 'title' && next.content && next.content[0]) {
          return next.content[0].text
        }
        return prev
      }, 'Untitled')
      const id = this.id
      this.$store.commit('tree/updateNode', {
        compareFn (node) {
          return node.contentId.toString() === id.toString()
        },
        fn (node) {
          return { ...node, title: newTitle }
        }
      })
      deb(api.getJSON())
    })
    this.focusToEditor()
  },
  destroyed () {
  },
  methods: {
    async fetchUsers () {
      return (await api.get('spaces/' + this.activeSpace.id + '/users')).data.data
    },
    async fetchReferences () {
      return (await api.get('spaces/' + this.activeSpace.id + '/tree')).data.data
    },
    getTextDisplayType (isActive) {
      if (isActive.paragraph()) {
        return 'Normal Text'
      }
      if (isActive.heading({ level: 1 })) {
        return 'Heading 1'
      }
      if (isActive.heading({ level: 2 })) {
        return 'Heading 2'
      }
      if (isActive.heading({ level: 3 })) {
        return 'Heading 3'
      }
      if (isActive.heading({ level: 4 })) {
        return 'Heading 4'
      }
      return 'Normal Text'
    },
    getTextAlignmentType (align) {
      switch (align) {
        case 'left':
          return 'Left'
        case 'center':
          return 'Center'
        case 'right':
          return 'Right'
        case 'justify':
          return 'Justify'
      }
      return 'Left'
    },
    getTextAlignmentIcon (align) {
      switch (align) {
        case 'left':
          return AlignLeftIcon
        case 'center':
          return AlignCenterIcon
        case 'right':
          return AlignRightIcon
        case 'justify':
          return AlignJustifyIcon
      }
      return AlignLeftIcon
    },
    getListTypeIcon (isActive) {
      if (isActive.todo_list()) {
        return CheckSquareIcon
      }
      return ListIcon
    },
    showLinkForm (attr) {
      this.linkMarking.active = true
      this.linkMarking.href = attr.href
      this.$nextTick(() => {
        if (this.$refs.linkInput) {
          this.$refs.linkInput.focus()
        }
      })
    },
    focusToEditor () {
      if (this.editor) {
        if (this.editor.state.doc.content.firstChild.content.size === 0) {
          this.editor.focus('start')
        } else {
          this.editor.focus('end')
        }
      }
    },
    hideLinkForm () {
      this.linkMarking.active = false
      this.linkMarking.href = null
    },
    setLinkData (command, href) {
      command({ href })
      this.hideLinkForm()
    },
    visitLink (attr) {
      window.open(attr.href, '_blank')
    },
    async load () {
      const id = this.$route.params.id
      if (id && !this.doc) {
        if (this.provider) {
          this.provider.awareness.setLocalStateField('user', {
            color: '#333',
            name: this.currentUser.firstName
          })
        }
        const res = await DocumentService.view(id)
        this.doc = res.data
        this.pageTitle = res.data.title
        this.editor.setContent(res.data.content)
      }
    },
    async save (data) {
      const title = data.content.reduce((prev, next) => {
        if (next.type === 'title' && next.content && next.content[0]) {
          return next.content[0].text
        }
        return prev
      }, 'Untitled')
      this.pageTitle = title
      const payload = {
        spaceId: this.activeSpace.id,
        title: title,
        content: data,
        access: 2,
        isLocked: false
      }

      await this.createUpdateDocument(payload)
    },
    async createUpdateDocument (data) {
      try {
        const id = this.$route.params.id
        this.loading = true

        if (id) {
          const res = await DocumentService.update(id, data)
          this.doc = res.data.data
          this.$store.commit('tree/updateNode', {
            compareFn (node) {
              return node.contentId.toString() === id
            },
            fn (node) {
              return {
                ...node,
                title: data.title
              }
            }
          })
        }
        this.loading = false
      } catch (err) {
        this.loading = false
      }
    },
    toggleReadOnly () {
      this.readOnly = !this.readOnly
      this.isHistoryVisible = false
    },
    showHistory () {
      this.isHistoryVisible = true
    },
    deleteNovadoc () {
      window.app.confirm('Delete document?', `Delete document ${this.doc.title} permanently?`, async () => {
        try {
          await this.$store.dispatch('document/destroy', this.doc)
          await this.$store.dispatch('tree/fetch', { spaceId: this.activeSpace.id })
          this.$router.push({ name: 'Main' })
        } catch (err) {
        }
      })
    },
    restore (state) {
      this.save(state.content)
      this.preview = null
      this.editor.setContent(state.content)
    },
    showPreview (state) {
      this.editor.setOptions({
        editable: false
      })
      if (!state) {
        this.preview = null
        this.editor.setContent(this.doc.content)
      } else {
        this.preview = state
        this.editor.setContent(state.content)
      }
    },
    closeHistory () {
      this.isHistoryVisible = false
      this.editor.setOptions({
        editable: !this.readOnly
      })
    }
  },
  watch: {
    id: {
      immediate: true,
      async handler () {
        await this.load()
        await this.$store.dispatch('tree/fetch', { spaceId: this.activeSpace.id })
        if (!this.pageReady) {
          await this.activateSpace(this.activeSpace.id)
        }
        this.pageReady = true
        this.focusToEditor()
      }
    },
    readOnly: {
      async handler () {
        this.editor.setOptions({
          editable: !this.readOnly
        })
      }
    }
  },
  computed: {
    leftOffset () {
      return this.$refs.page.offsetLeft
    },
    activeSpace () {
      return this.$store.getters['space/activeSpace']
    },
    currentUser () {
      return this.$store.state.auth.user
    },
    id () {
      return Number(this.$route.params.id) || 0
    },
    colors () {
      return [
        '#000',
        '#fff',
        '#C53',
        '#3a3',
        '#35A',
        '#3AA',
        '#A3A',
        '#BA8',
        '#333',
        '#777'
      ]
    }
  }

}
</script>

<style lang="postcss" scoped>
.page {
  @apply pt-4;
  position: relative;
  display: flex;
  width: 0;
  flex: 1 1 auto;
  flex-direction: column;
}
.page-header {
  position: fixed;
  top: 0;
  display: flex;
  background: #fff;
  z-index: 1;
  width: 100%;
  box-shadow:0 2px 4px rgba(0,0,0,0.15);
  padding: 12px 24px;
  box-sizing: border-box;
}

.page-history {
  position: fixed;
  top:0;
  right: 0;
  z-index: 50;
  width: 256px;
  height: 100vh;
  background: #fafafa;
  flex: 0 0 auto;
  overflow-y: scroll;
}
.page-editor {
  width: 800px;
  margin: 0 auto;
  padding: 96px 0;
  flex: 1 1 auto;
}

.menubar {
  display: flex;
  align-items: center;
  font-size: 12px;
}

.menubar.focused {
  visibility: visible;
  opacity: 1;
}

.menu {
  background: #fff;
  color: #333;
  border: none;
  padding: 4px 6px;
  outline: none;
  border-radius: 2px;
  transition: all 0.15s ease;
  margin-right: 4px;
}

.menu-separator {
  width: 1px;
  height: 24px;
  background: #E0E2E7;
  margin:0 8px;
  display: inline-block;
}

.menu:last-child {
  margin-right: 0;
}

.menu:hover {
  background: #eee;
}

.menu.active, .menu:active {
  background: #146493;
  color: #fff;
}

.bubble {
  position: absolute;
  opacity: 0;
  visibility: hidden;
  font-size: 12px;
  display: flex;
  align-items: center;
  z-index: 1;
  box-shadow: 0 1px 2px rgba(0, 0, 0, .1), 0 2px 14px rgba(0, 0, 0, .05);
  margin-bottom: 4px;
  background: #fff;
  border-radius: 2px;
  padding: 4px;

  &.is-active {
    visibility: visible;
    opacity: 1;
  }
}

.bubble-form {
  margin: 4px;
  display: flex;
  align-self: center;
}

.bubble-input {
  font-size: 12px;
  padding: 4px;
  border-radius: 4px;
  border: none;
  outline: none;
  min-width: 220px;
  flex: 1 1 auto;
}

.bubble-form-yes {
  flex: 0 0 auto;
  border: none;
  padding: 4px 6px;
  color: #146493;

  &:hover {
    background: #eee;
  }
}

.bubble-form-no {
  flex: 0 0 auto;
  border: none;
  padding: 4px 6px;
  color: #aaa;

  &:hover {
    background: #eee;
    color: #333;
  }
}

.color-blocks {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 8px;
  padding: 24px;
}
.color-block {
  width: 24px;
  height: 24px;
  border-radius: 2px;
  transition: all 0.15s ease;
  border:solid 1px #146493;
  &:hover {
    transform:scale(0.9);
  }
}
.bg-color, .text-color {
  padding: 2px 4px;
  box-sizing: border-box;
  font-size: 12px;
}

.editor-menu{
  display: flex;
  align-items: center;
  .menubar{
    flex: 1 1 auto;
  }
  .menu-options {
    flex: 0 0 auto;
  }
  .menu-btn {
    padding: 12px;
  }
}

.action-line {
  @apply flex items-center py-2 px-4 my-1;
  min-width: 168px;
  color: theme("colors.gray.900");
  stroke-width: 3px;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  line-height: 16px;

  &:hover{
    background: #F0F2F5;
  }
  &.danger {
    color: theme("colors.danger.default");
  }
}
.action-line-text {
  @apply ml-2;
  flex: 1 1 auto;
}
.action-separator{
  @apply my-1;
  height:1px;
  background: theme("colors.gray.100");
}

</style>
<style lang="postcss">
.ProseMirror {
  outline: none;
}

.ProseMirror > .ProseMirror-yjs-cursor:first-child {
  margin-top: 16px;
}

.ProseMirror p:first-child, .ProseMirror h1:first-child, .ProseMirror h2:first-child, .ProseMirror h3:first-child, .ProseMirror h4:first-child, .ProseMirror h5:first-child, .ProseMirror h6:first-child {
  margin-top: 16px
}

.ProseMirror-yjs-cursor {
  position: absolute;
  height: 1em;
  word-break: normal;
  pointer-events: none;
  opacity: 0.8;
  margin-left: -6px;
}

.ProseMirror-yjs-cursor::after {
  content: ' ';
  display: block;
  position: absolute;
  top: -5px;
  left: 6px;
  width: 8px;
  height: 8px;
  background: #333;
  transform: rotate(45deg);
}

.ProseMirror-yjs-cursor > div {
  position: relative;
  top: -24px;
  font-size: 13px;
  border-radius: 2px;
  line-height: normal;
  user-select: none;
  color: white;
  padding: 4px;
}

.ProseMirror {

  font-size: 16px;

  &.resize-cursor {
    cursor: col-resize;
  }

  .novadoc-title {
    font-size: 2.4em;
  }

  h1, h2, h3, h4 {
    margin: 24px 0 8px 0;
  }

  h1 {
    font-size: 2em;
  }

  h2 {
    font-size: 1.7em;
  }

  h3 {
    font-size: 1.5em;
  }

  h4 {
    font-size: 1.35em;
  }

  p {
    font-size: 1em;
  }

  ul {
    list-style: disc;
    margin-left: 18px;
  }

  ol {
    list-style: decimal;
    margin-left: 18px;
  }

  a {
    text-decoration: underline;
    color: #146493;
  }

  blockquote {
    padding: 16px;
    background: #fff;
    border: solid 1px #ddd;
    border-radius: 4px;
    position: relative;
    margin: 16px 0 24px 0;

    &::after {
      content: ' ';
      width: 16px;
      height: 16px;
      background: #fff;
      border-bottom: solid 1px #ddd;
      border-right: solid 1px #ddd;
      transform: rotate(45deg);
      position: absolute;
      bottom: -9px;
    }

    > p:first-child {
      margin-top: 0;
    }
  }

  code {
    padding: 4px;
    background: #ddd;
    border-radius: 2px;
    font-size: 0.8em;
  }

  p:first-child, h1:first-child, h2:first-child, h3:first-child, h4:first-child, h5:first-child, h6:first-child {
    margin-top: inherit;
  }

  .novadoc-divider {
    color: #ccc;
    margin: 16px;
  }

  table {
    width: 100%;
    max-width: 800px;
    margin: 48px 0;
    position: relative;

    tr {
      td {
        border: solid 1px #ccc;
        padding: 8px;
        position: relative;
        &.selectedCell {
          background: #def;
        }
      }
    }

    .column-resize-handle {
      background: #ccca;
      width: 4px;
      height: 100%;
      top: 0;
      right: -2px;
      position: absolute;
    }
  }
  .novadoc-table-menu {
    position: absolute;
    top: -40px;
    font-size: 12px;
    display: flex;
    align-items: center;
    z-index: 10;
    box-shadow: 0 1px 2px rgba(0, 0, 0, .1), 0 2px 14px rgba(0, 0, 0, .05);
    background: #fff;
    padding: 4px;
    cursor: default;
  }
  .novadoc-table-menu-button {
    background: #fff;
    color: #333;
    border: none;
    padding: 4px 6px;
    outline: none;
    border-radius: 2px;
    transition: all 0.15s ease;
    margin-right: 4px;

    &:hover {
      background: #eee;
    }

  }

  ul[data-type="todo_list"] {
    padding-left: 0;
  }
  li[data-type="todo_item"] {
    display: flex;
    flex-direction: row;
  }
  .todo-checkbox {
    border: 2px solid #146493;
    height: 0.9em;
    width: 0.9em;
    box-sizing: border-box;
    margin-right: 10px;
    margin-top: 0.3rem;
    user-select: none;
    -webkit-user-select: none;
    cursor: pointer;
    border-radius: 0.2em;
    background-color: transparent;
    transition: 0.4s background;
  }
  .todo-content {
    flex: 1;
    > p:last-of-type {
      margin-bottom: 0;
    }
    > ul[data-type="todo_list"] {
      margin: .5rem 0;
    }
  }
  li[data-done="true"] {
    > .todo-content {
      > p {
        text-decoration: line-through;
        opacity: 0.85;
      }
    }
    > .todo-checkbox {
      background-color: #146493;
    }
  }
  li[data-done="false"] {
    text-decoration: none;
  }

  ul, ol {
    margin-top: 16px;
    margin-bottom: 16px;
    ul, ol {
      margin-top: 8px;
    }
  }

  .novadoc-image {
    margin: 36px auto;
    border-radius: 4px;
    transition: all 0.15s ease;
    border:solid 4px transparent;
    padding: 4px;

    &.ProseMirror-selectednode {
      //box-shadow: 0 2px 4px rgba(0,0,0,.25), 0 16px 64px rgba(0,0,0,.5);
      border: solid 4px #146493;
    }
  }

  .novadoc-mention {
    color: #146493;
    font-weight: bolder;
    padding: 4px;
    border-radius: 4px;
    &.ProseMirror-selectednode {
      background:  #ddd;
      color: #333;
    }
  }

  pre > code {
    display: block;
    padding: 12px;
    background: #333;
    border-radius: 2px;
    font-size: 0.8em;
    color: #eee;
    margin: 12px 0;

    .hljs {
      display: block;
      overflow-x: auto;
      padding: 0.5em;
      background: #282a36;
    }

    .hljs-keyword,
    .hljs-selector-tag,
    .hljs-literal,
    .hljs-section,
    .hljs-link {
      color: #8be9fd;
    }

    .hljs-function .hljs-keyword {
      color: #ff79c6;
    }

    .hljs,
    .hljs-subst {
      color: #f8f8f2;
    }

    .hljs-string,
    .hljs-title,
    .hljs-name,
    .hljs-type,
    .hljs-attribute,
    .hljs-symbol,
    .hljs-bullet,
    .hljs-addition,
    .hljs-variable,
    .hljs-template-tag,
    .hljs-template-variable {
      color: #f1fa8c;
    }

    .hljs-comment,
    .hljs-quote,
    .hljs-deletion,
    .hljs-meta {
      color: #6272a4;
    }

    .hljs-keyword,
    .hljs-selector-tag,
    .hljs-literal,
    .hljs-title,
    .hljs-section,
    .hljs-doctag,
    .hljs-type,
    .hljs-name,
    .hljs-strong {
      font-weight: bold;
    }

    .hljs-emphasis {
      font-style: italic;
    }
  }

}

.page-editor *.is-empty:nth-child(1)::before,
.page-editor *.is-empty:nth-child(2)::before {
  content: attr(data-empty-text);
  float: left;
  color: #aaa;
  pointer-events: none;
  height: 0;
}
</style>
