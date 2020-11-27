<template>
  <div class="page" ref="page">
    <header class="page-header" :class="{scrolled: pageScrolled}">
      <editor-menu-bar ref="menuBar" :editor="editor"
                       v-slot="{ commands, isActive, getMarkAttrs, getNodeAttrs, focused }">
        <div class="editor-toolbar">
          <MenuGroup value="Normal Text" :disabled="!canChangeTextType(isActive, focused)"
                     v-tippy="{ placement : 'top',  arrow: true }" content="Text Style">
            <template #default>
              <div style="padding-right: 32px;">
                {{ getTextDisplayType(isActive) }}
              </div>
            </template>
            <template #options="{select, hide}">
              <MenuGroupOption @click="select('Normal Text');hide();commands.paragraph({level: 0})">
                <template #icon>
                  Tt
                </template>
                <template #label>
                  Normal Text
                </template>
              </MenuGroupOption>
              <MenuGroupOption @click="select('Heading 1');hide();commands.paragraph({level: 1})">
                <template #icon>
                  H1
                </template>
                <template #label>
                  Heading 1
                </template>
              </MenuGroupOption>
              <MenuGroupOption @click="select('Heading 2');hide();commands.paragraph({level: 2})">
                <template #icon>
                  H2
                </template>
                <template #label>
                  Heading 2
                </template>
              </MenuGroupOption>
              <MenuGroupOption @click="select('Heading 3');hide();commands.paragraph({level: 3})">
                <template #icon>
                  H3
                </template>
                <template #label>
                  Heading 3
                </template>
              </MenuGroupOption>
            </template>
          </MenuGroup>
          <div class="menu-separator"></div>
          <button class="menu" :class="{ 'active': isActive.bold() }" :disabled="!canBeBold(isActive, focused)"
                  @click="commands.bold" v-tippy="{ placement : 'top',  arrow: true }" content="Bold">
            <BoldIcon size="16"></BoldIcon>
          </button>
          <button class="menu" :class="{ 'active': isActive.italic() }" :disabled="!canBeItalic(isActive, focused)"
                  @click="commands.italic" v-tippy="{ placement : 'top',  arrow: true }" content="Italic">
            <ItalicIcon size="16"></ItalicIcon>
          </button>
          <button class="menu" :class="{ 'active': isActive.underline() }"
                  :disabled="!canBeUnderline(isActive, focused)"
                  @click="commands.underline" v-tippy="{ placement : 'top',  arrow: true }" content="Underline">
            <UnderlineIcon size="16"></UnderlineIcon>
          </button>
          <button class="menu" :class="{ 'active': isActive.strike() }"
                  :disabled="!canBeStrikethrough(isActive, focused)" @click="commands.strike"
                  v-tippy="{ placement : 'top',  arrow: true }" content="Strikethrough">
            <span>
              <v-icon name="strike" viewbox="16" size="16"></v-icon>
            </span>
          </button>
          <button class="menu" :class="{ 'active': isActive.code() }" :disabled="!canBeInlineCode(isActive, focused)"
                  @click="commands.code" v-tippy="{ placement : 'top',  arrow: true }" content="Inline Code">
            <TerminalIcon size="16"></TerminalIcon>
          </button>
          <div class="menu-separator"></div>
          <MenuGroup value="Left" :disabled="!canBeAligned(isActive, focused)" v-tippy="{ placement : 'top',  arrow: true }" content="Alignment">
            <template #default>
              <component :is="getalignmentIcon(getNodeAttrs('paragraph').align)" size="14"></component>
            </template>
            <template #options="{select, hide}">
              <MenuGroupOption @click="select('Left');hide();commands.paragraph({align: 'left'})">
                <template #icon>
                  <AlignLeftIcon size="16"></AlignLeftIcon>
                </template>
                <template #label>
                  Left
                </template>
              </MenuGroupOption>
              <MenuGroupOption @click="select('Center');hide();commands.paragraph({align: 'center'})">
                <template #icon>
                  <AlignCenterIcon size="16"></AlignCenterIcon>
                </template>
                <template #label>
                  Center
                </template>
              </MenuGroupOption>
              <MenuGroupOption @click="select('Right');hide();commands.paragraph({align: 'right'})">
                <template #icon>
                  <AlignRightIcon size="16"></AlignRightIcon>
                </template>
                <template #label>
                  Right
                </template>
              </MenuGroupOption>
              <MenuGroupOption @click="select('Justify');hide();commands.paragraph({align: 'justify'})">
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
          <MenuGroup value="#000" :disabled="!canBeTextColored(isActive, focused)" :show-arrow="false" v-tippy="{ placement : 'top',  arrow: true }" content="Text Color">
            <template #default>
              <div class="text-color" :style="{
                  color: getMarkAttrs('text_color') ? getMarkAttrs('text_color').color : '#000',
                  background: getMarkAttrs('text_color') && getMarkAttrs('text_color').color === '#fff' ? '#333' : 'transparent'
                }">Tt
              </div>
            </template>
            <template #options="{select, hide}">
              <div class="color-blocks text-color-blocks">
                <div v-for="color in textColors" :key="color" class="color-block"
                     :style="{background: color, border: color === '#FFFFFF' ? 'solid 1px #DEE2EE' : ''}"
                     @click="select(color);hide();commands.text_color({color: color})"></div>
              </div>
            </template>
          </MenuGroup>
          <MenuGroup value="#000" :disabled="!canBeBgColored(isActive, focused)" :show-arrow="false" v-tippy="{ placement : 'top',  arrow: true }" content="Background Color">
            <template #default>
              <v-icon name="pen" viewbox="16" size="14"
                      v-if="!getMarkAttrs('bg_color').color || getMarkAttrs('bg_color').color === '#fff'"></v-icon>
              <div class="bg-color bg-color-display" v-else
                   :style="{background: getMarkAttrs('bg_color') ? getMarkAttrs('bg_color').color : '#fff'}">
              </div>
            </template>
            <template #options="{select, hide}">
              <div class="color-blocks">
                <div v-for="color in colors" :key="color" class="color-block"
                     :style="{background: color, border: color === '#FFFFFF' ? 'solid 1px #DEE2EE' : ''}"
                     @click="select(color);hide();commands.bg_color({color: color})"></div>
              </div>
            </template>
          </MenuGroup>
          <div class="menu-separator"></div>
          <button class="menu" :class="{ 'active': isActive.bullet_list() } "
                  :disabled="!canBeConvertedToList(isActive, focused)"
                  @click="commands.bullet_list" v-tippy="{ placement : 'top',  arrow: true }" content="Bullet List">
            <ListIcon size="16"></ListIcon>
          </button>
          <button class="menu" :class="{ 'active': isActive.ordered_list() }"
                  :disabled="!canBeConvertedToList(isActive, focused)"
                  @click="commands.ordered_list" v-tippy="{ placement : 'top',  arrow: true }" content="Numbered List">
            <v-icon name="ordered-list" viewbox="16" size="16"></v-icon>
          </button>
          <div class="menu-separator"></div>
          <button class="menu" :class="{ 'active': isActive.todo_list() }"
                  :disabled="!canBeConvertedToList(isActive, focused)"
                  @click="commands.todo_list" v-tippy="{ placement : 'top',  arrow: true }" content="Checklist">
            <CheckSquareIcon size="16"></CheckSquareIcon>
          </button>
          <button class="menu" :class="{ 'active': isActive.image() }" :disabled="!canInsertImage(isActive, focused)"
                  @click="commands.image({docId: id, spaceId: activeSpace.id})" v-tippy="{ placement : 'top',  arrow: true }" content="Image">
            <ImageIcon size="16"></ImageIcon>
          </button>
          <MenuGroup :value="getMarkAttrs('link').href" :disabled="!canBeLinked(isActive, focused)" :show-arrow="false"
                     v-tippy="{ placement : 'top',  arrow: true }" content="Link">
            <template #default>
              <LinkIcon size="16"></LinkIcon>
            </template>
            <template #options="{ hide }">
              <NovadocLinkInput @cancel="hide()" @submit="commands.link({href: $event});hide();"></NovadocLinkInput>
            </template>
          </MenuGroup>
          <button class="menu" :class="{ 'active': isActive.divider() }" :disabled="!canInsertLine(isActive, focused)"
                  @click="commands.divider" v-tippy="{ placement : 'top',  arrow: true }" content="Horizontal line">
            <MinusIcon size="16"></MinusIcon>
          </button>
          <button class="menu" :class="{ 'active': isActive.blockquote() }"
                  :disabled="!canBeConvertedToQuote(isActive, focused)"
                  @click="commands.blockquote" v-tippy="{ placement : 'top',  arrow: true }" content="Blockquote">
            <v-icon viewbox="16" name="quote" size="16"></v-icon>
          </button>
          <button class="menu" :class="{ 'active': isActive.code_block() }"
                  :disabled="!canBeConvertedToCodeBlock(isActive, focused)"
                  @click="commands.code_block" v-tippy="{ placement : 'top',  arrow: true }" content="Code block">
            <CodeIcon size="16"></CodeIcon>
          </button>
          <div class="menu-separator"></div>
          <button
            class="menu" :disabled="!canCreateTable(isActive, focused)"
            @click="commands.createTable({rowsCount: 3, colsCount: 3, withHeaderRow: false })"
            v-tippy="{ placement : 'top',  arrow: true }" content="Table"
          >
            <v-icon name="table" viewbox="16" size="16"></v-icon>
          </button>
          <div class="menu-separator"></div>
          <button class="menu" @click="commands.undo" v-tippy="{ placement : 'top',  arrow: true }" content="Undo">
            <v-icon name="undo" viewbox="16" size="16"></v-icon>
          </button>
          <button class="menu" @click="commands.redo" v-tippy="{ placement : 'top',  arrow: true }" content="Redo">
            <v-icon name="redo" viewbox="16" size="16"></v-icon>
          </button>
        </div>
      </editor-menu-bar>
      <div class="editor-context-menu">
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
    </header>
    <div class="page-editor" @click.self="focusToEditor" @scroll="determineHeaderState" ref="pageEditor">
      <div class="paper" ref="paper" @mousedown="isMouseDown = true">
        <editor-menu-bubble :editor="editor" v-slot="{ isActive, focused, commands, menu, getNodeAttrs, getMarkAttrs }">
          <div>
            <div class="link-bubble bubble" ref="linkBubble" v-if="!canShowBubble(isActive, menu) && isActive.link()"
                 :style="getBubblePosition()">
              <div class="bubble-wrap">
                <MenuGroup :value="getMarkAttrs('link').href" :show-arrow="false">
                  <template #default>
                    <v-icon name="edit2" viewbox="16" size="16" v-tippy="{ placement : 'top',  arrow: true }" content="Edit Link"></v-icon>
                  </template>
                  <template #options="{ hide }">
                    <NovadocLinkInput @cancel="hide()" @submit="commands.link({href: $event});hide();" :value="getMarkAttrs('link').href"></NovadocLinkInput>
                  </template>
                </MenuGroup>
                <NovadocMenuButton @click="commands.link({})" v-tippy="{ placement : 'top',  arrow: true }" content="Unlink">
                  <v-icon name="unlink" viewbox="16" size="16"></v-icon>
                </NovadocMenuButton>
                <NovadocMenuSeparator></NovadocMenuSeparator>
                <NovadocMenuButton @click="openLink(getMarkAttrs('link').href)" v-tippy="{ placement : 'top',  arrow: true }" :content="getMarkAttrs('link').href">
                  <v-icon name="open-link" viewbox="16" size="16"></v-icon>
                </NovadocMenuButton>
              </div>
            </div>

            <div class="bubble" ref="bubble" :style="getBubblePosition()">
            <div class="bubble-wrap" v-if="canShowBubble(isActive, menu)" @mousedown.stop>
              <button class="menu" :class="{ 'active': isActive.bold() }" v-if="canBeBold(isActive, true)"
                      @click="commands.bold" v-tippy="{ placement : 'top',  arrow: true }" content="Bold">
                <BoldIcon size="16"></BoldIcon>
              </button>
              <button class="menu" :class="{ 'active': isActive.italic() }" v-if="canBeItalic(isActive, true)"
                      @click="commands.italic" v-tippy="{ placement : 'top',  arrow: true }" content="Italic">
                <ItalicIcon size="16"></ItalicIcon>
              </button>
              <button class="menu" :class="{ 'active': isActive.underline() }" v-if="canBeUnderline(isActive, true)"
                      @click="commands.underline" v-tippy="{ placement : 'top',  arrow: true }" content="Underline">
                <UnderlineIcon size="16"></UnderlineIcon>
              </button>
              <button class="menu" :class="{ 'active': isActive.strike() }" v-if="canBeStrikethrough(isActive, true)"
                      @click="commands.strike" v-tippy="{ placement : 'top',  arrow: true }" content="Strikethrough">
              <span>
                <v-icon name="strike" viewbox="16" size="16"></v-icon>
              </span>
              </button>
              <button class="menu" :class="{ 'active': isActive.code() }" v-if="canBeInlineCode(isActive, true)"
                      @click="commands.code" v-tippy="{ placement : 'top',  arrow: true }" content="Inline Code">
                <TerminalIcon size="16"></TerminalIcon>
              </button>
              <MenuGroup value="#000" v-if="canBeTextColored(isActive, true)" :show-arrow="false" v-tippy="{ placement : 'top',  arrow: true }" content="Text Color">
                <template #default>
                  <div class="text-color text-color-display" :style="{
                  color: getMarkAttrs('text_color') ? getMarkAttrs('text_color').color : '#000',
                  background: getMarkAttrs('text_color') && getMarkAttrs('text_color').color === '#fff' ? '#333' : 'transparent'
                }">Tt
                  </div>
                </template>
                <template #options="{select, hide}">
                  <div class="color-blocks text-color-blocks">
                    <div v-for="color in textColors" :key="color" class="color-block"
                         :style="{background: color, border: color === '#FFFFFF' ? 'solid 1px #DEE2EE' : ''}"
                         @click="select(color);hide();commands.text_color({color: color})"></div>
                  </div>
                </template>
              </MenuGroup>
              <MenuGroup value="#000" v-if="canBeBgColored(isActive, true)" :show-arrow="false" v-tippy="{ placement : 'top',  arrow: true }" content="Background Color">
                <template #default>
                  <v-icon name="pen" viewbox="16" size="14"
                          v-if="!getMarkAttrs('bg_color').color || getMarkAttrs('bg_color').color === '#fff'"></v-icon>
                  <div class="bg-color bg-color-display" v-else
                       :style="{background: getMarkAttrs('bg_color') ? getMarkAttrs('bg_color').color : '#fff'}">
                  </div>
                </template>
                <template #options="{select, hide}">
                  <div class="color-blocks">
                    <div v-for="color in colors" :key="color" class="color-block"
                         :style="{background: color, border: color === '#FFFFFF' ? 'solid 1px #DEE2EE' : ''}"
                         @click="select(color);hide();commands.bg_color({color: color})"></div>
                  </div>
                </template>
              </MenuGroup>
              <NovadocMenuSeparator v-if="canBeLinked(isActive, true)"></NovadocMenuSeparator>
              <MenuGroup :value="getMarkAttrs('link').href" :show-arrow="false" v-tippy="{ placement : 'top',  arrow: true }" content="Link"
                v-if="canBeLinked(isActive, true)">
                <template #default>
                  <v-icon name="edit2" viewbox="16" size="16" v-if="isActive.link()"></v-icon>
                  <LinkIcon size="16" v-else></LinkIcon>
                </template>
                <template #options="{ hide }">
                  <NovadocLinkInput @cancel="hide()" @submit="commands.link({href: $event});hide();" :value="getMarkAttrs('link').href"></NovadocLinkInput>
                </template>
              </MenuGroup>
              <NovadocMenuButton @click="commands.link({})" v-if="isActive.link()"  v-tippy="{ placement : 'top',  arrow: true }" content="Unlink">
                <v-icon name="unlink" viewbox="16" size="16"></v-icon>
              </NovadocMenuButton>
              <NovadocMenuSeparator v-if="getMarkAttrs('link').href"></NovadocMenuSeparator>
              <NovadocMenuButton @click="openLink(getMarkAttrs('link').href)" v-if="isActive.link()" v-tippy="{ placement : 'top',  arrow: true }" :content="getMarkAttrs('link').href">
                <v-icon name="open-link" viewbox="16" size="16"></v-icon>
              </NovadocMenuButton>
            </div>
          </div>
          </div>
        </editor-menu-bubble>
        <textarea title="Title" ref="title" class="editor-title-input" placeholder="Untitled" v-model="title"
                  @focus="isTitleFocused = true"
                  @blur="isTitleFocused = false"
                  @keyup="debouncedSaveTitleOnly" @keypress.enter="handleTitleEnter"></textarea>
        <EditorContent :editor="editor"></EditorContent>
      </div>
    </div>
    <div class="page-history" v-show="isHistoryVisible">
      <DocHistory ref="docHistory" :doc="doc" :preview="preview" :id="id" @close="closeHistory" @preview="showPreview"
                  @restore="restore"></DocHistory>
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
  HardBreak,
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
  TableRow,
  TodoItem,
  TodoList,
  TrailingNode,
  Underline
} from 'tiptap-extensions'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import bash from 'highlight.js/lib/languages/bash'
import ButtonSwitch from '@/components/ButtonSwitch'

import Novaschema from '@/views/Novadoc/Novaschema.js'
// import Title from '@/views/Novadoc/Title.js'
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  CheckIcon,
  CheckSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CodeIcon,
  ColumnsIcon,
  ImageIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  MessageCircleIcon,
  MinusIcon,
  TerminalIcon,
  TrashIcon,
  UnderlineIcon,
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
import NovadocLinkInput from '@/views/Novadoc/Menu/NovadocLinkInput'
import NovadocMenuButton from '@/views/Novadoc/Menu/NovadocMenuButton'
import NovadocMenuSeparator from '@/views/Novadoc/Menu/NovadocMenuSeparator'

export default {
  mixins: [SpaceMixin, PageMixin],
  components: {
    NovadocMenuSeparator,
    NovadocMenuButton,
    NovadocLinkInput,
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
    const debouncedSaveTitleOnly = debounce(() => {
      this.saveTitleOnly(this.title)
    }, 1000)
    return {
      provider: null,
      doc: null,
      preview: null,
      linkMarking: {
        active: false,
        href: null
      },
      title: '',
      readOnly: false,
      isHistoryVisible: false,
      debouncedSaveTitleOnly: debouncedSaveTitleOnly,
      editor: new Editor({
        editable: true,
        extensions: [
          new Novaschema(),
          new Mention('@', this.fetchUsers),
          new Reference('#', this.fetchReferences),
          // new Title(),
          new Divider(),
          new Paragraph(),
          new TextColor(),
          new BgColor(),
          new Bold(),
          new Blockquote(),
          new CodeBlockHighlight({
            languages: {
              javascript,
              typescript,
              bash
            }
          }),
          new HardBreak(),
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
            emptyNodeText: () => {
              if (this.editor && this.editor.state.doc.content && this.editor.state.doc.content.content.length > 1) {
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
          content: []
        }
      }),
      pageScrolled: false,
      isBubbleFocused: false,
      isTitleFocused: false,
      nodeNameChangesListener: null,
      isMouseDown: false
    }
  },
  beforeDestroy () {
    this.editor.destroy()
  },
  async mounted () {
    const debouncedSave = debounce((json) => {
      this.save(json)
    }, 1000)
    this.editor.on('update', (api) => {
      const newTitle = this.title
      const id = this.id
      this.$store.commit('tree/updateNode', {
        compareFn (node) {
          return node.contentId.toString() === id.toString()
        },
        fn (node) {
          return {
            ...node,
            title: newTitle
          }
        }
      })
      debouncedSave(api.getJSON())
    })
    this.listenForNodeNameChanges()
    this.focusToEditor()
    this.listenForDocumentMouseUp()
  },
  destroyed () {
    if (this.nodeNameChangesListener) {
      this.nodeNameChangesListener()
    }
    document.removeEventListener('mouseup', this.releaseMouseDown)
  },
  methods:
    {
      listenForNodeNameChanges () {
        this.nodeNameChangesListener = this.$store.subscribe(async (mutation) => {
          if (mutation.type === 'tree/setList') {
            const referencedNode = mutation.payload.find(node => node.contentId.toString() === this.id.toString())
            if (referencedNode) {
              if (referencedNode.title.charCodeAt(0) === 1 && referencedNode.title.charCodeAt(1) === 2) {
                this.title = ''
              } else {
                this.title = referencedNode.title
              }
            }
          }
        })
      },
      getBubblePosition () {
        const sel = this.editor.state.selection
        const coords = this.editor.view.coordsAtPos(sel.$from.pos)
        const offsetTop = 48
        if (this.$refs.pageEditor) {
          const left = coords.x - this.$refs.pageEditor.offsetLeft - this.$refs.pageEditor.offsetParent.offsetLeft
          return {
            left: left + 'px',
            top: coords.top - offsetTop - this.$refs.pageEditor.offsetTop + this.$refs.pageEditor.scrollTop + 'px'
          }
        }
        return {
          left: '0',
          top: coords.top - offsetTop + 'px'
        }
      },
      focusBubble () {
        this.isBubbleFocused = true
      },
      canInsertImage (isActive, focused) {
        if (isActive.paragraph({ level: 0 }) && focused) {
          return true
        }
      },
      canInsertLine (isActive, focused) {
        if (isActive.paragraph({ level: 0 }) && focused) {
          return true
        }
      },
      canBeLinked (isActive, focused) {
        if (isActive.paragraph({ level: 0 }) && focused) {
          return true
        }
      },
      canBeBold (isActive, focused) {
        if (isActive.paragraph({ level: 0 }) && focused) {
          return true
        }
      },
      canBeItalic (isActive, focused) {
        if (isActive.paragraph({ level: 0 }) && focused) {
          return true
        }
      },
      canBeUnderline (isActive, focused) {
        if (isActive.paragraph({ level: 0 }) && focused) {
          return true
        }
      },
      canBeStrikethrough (isActive, focused) {
        if (isActive.paragraph({ level: 0 }) && focused) {
          return true
        }
      },
      canBeInlineCode (isActive, focused) {
        if (isActive.paragraph({ level: 0 }) && focused) {
          return true
        }
      },
      canBeAligned (isActive, focused) {
        if (isActive.paragraph() && focused) {
          return true
        }
      },
      canBeTextColored (isActive, focused) {
        if (isActive.paragraph() && focused) {
          return true
        }
      },
      canBeBgColored (isActive, focused) {
        if (isActive.paragraph({ level: 0 }) && focused) {
          return true
        }
      },
      canBeConvertedToList (isActive, focused) {
        if ((isActive.paragraph({ level: 0 }) || isActive.bullet_list() || isActive.ordered_list() || isActive.todo_list()) && focused) {
          return true
        }
      },
      canBeConvertedToQuote (isActive, focused) {
        if (isActive.paragraph({ level: 0 }) && focused) {
          return true
        }
      },
      canBeConvertedToCodeBlock (isActive, focused) {
        if ((isActive.paragraph({ level: 0 }) || isActive.code_block()) && focused) {
          return true
        }
      },
      canChangeTextType (isActive, focused) {
        if (isActive.paragraph() && !isActive.bullet_list() && !isActive.ordered_list() && !isActive.todo_list() && focused) {
          return true
        }
      },
      canCreateTable (isActive, focused) {
        if (isActive.paragraph({ level: 0 }) && focused) {
          return true
        }
      },
      async fetchUsers () {
        return (await api.get('spaces/' + this.activeSpace.id + '/users')).data.data
      },
      async fetchReferences () {
        return (await api.get('spaces/' + this.activeSpace.id + '/tree')).data.data
      },
      getTextDisplayType (isActive) {
        if (isActive.paragraph({ level: 0 })) {
          return 'Text'
        }
        if (isActive.paragraph({ level: 1 })) {
          return 'Heading 1'
        }
        if (isActive.paragraph({ level: 2 })) {
          return 'Heading 2'
        }
        if (isActive.paragraph({ level: 3 })) {
          return 'Heading 3'
        }
        return 'Text'
      },
      getalignmentType (align) {
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
      getalignmentIcon (align) {
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
          if (this.title.trim().length === 0) {
            this.$refs.title.focus()
          } else if (this.editor.state.doc.content.firstChild.content.size === 0) {
            this.editor.focus(1)
          } else {
            this.editor.focus(this.editor.state.doc.content.size - 1)
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
        if (id) {
          if (this.provider) {
            this.provider.awareness.setLocalStateField('user', {
              color: '#333',
              name: this.currentUser.firstName
            })
          }
          const res = await DocumentService.view(id)
          this.doc = res.data
          this.pageTitle = res.data.title
          this.title = res.data.title
          // Phantom emptiness detected
          if (this.title.charCodeAt(0) === 1 && this.title.charCodeAt(1) === 2) {
            this.pageTitle = 'Untitled'
            this.title = ''
            this.$refs.title.focus()
          }
          this.editor.setContent(res.data.content)
          this.autoResizeTitle()
        }
      },
      autoResizeTitle () {
        this.$refs.title.style.height = '1px'
        const height = this.$refs.title.scrollHeight
        this.$refs.title.style.height = height + 'px'
      },
      async save (data) {
        const title = this.title
        this.pageTitle = title
        const payload = {
          spaceId: this.activeSpace.id,
          title: title && title.trim().length > 0 ? title : String.fromCharCode(1, 2),
          content: data
        }
        await this.createUpdateDocument(payload)
      },
      async saveTitleOnly () {
        const title = this.title
        this.pageTitle = this.title
        const payload = {
          title: title && title.trim().length > 0 ? title : String.fromCharCode(1, 2)
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
      },
      handleTitleEnter (evt) {
        evt.preventDefault()
        this.editor.focus()
      },
      determineHeaderState (evt) {
        if (evt.target.scrollTop > 96) {
          this.pageScrolled = true
        } else {
          this.pageScrolled = false
        }
      },
      canShowBubble (isActive, menu) {
        return menu.isActive && !this.isTitleFocused && !isActive.image() && !this.isMouseDown && !isActive.mention() && !isActive.table()
      },
      openLink (url) {
        window.open(url, '_blank')
      },
      listenForDocumentMouseUp () {
        document.addEventListener('mouseup', this.releaseMouseDown)
      },
      releaseMouseDown () {
        this.isMouseDown = false
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
    title (newTitle) {
      this.autoResizeTitle()
      const id = this.id
      this.$store.commit('tree/updateNode', {
        compareFn (node) {
          return node.contentId.toString() === id.toString()
        },
        fn (node) {
          return {
            ...node,
            title: newTitle
          }
        }
      })
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
    textColors () {
      return [
        '#2C2B35',
        '#444754',
        '#AAB1C5',
        '#DEE2EE',
        '#E0E2E7',
        '#EDEFF3',
        '#F4F5F7',
        '#FFFFFF',
        '#4E32F0',
        '#9C3DBF',
        '#D64141',
        '#F2994A',
        '#219653',
        '#4574D3',
        '#8CD5FF',
        '#65F3E3'
      ]
    },
    colors () {
      return [
        '#DED3F8',
        '#F6DDFF',
        '#FFE0E0',
        '#FFEAD2',
        '#DEFFD9',
        '#E0EAFF',
        '#DDF3FF',
        '#65F3E3',
        '#F4F5F7',
        '#FFFFFF'
      ]
    }
  }

}
</script>

<style lang="postcss" scoped>
.page {
  position: relative;
  display: flex;
  width: 0;
  flex: 1 1 auto;
  flex-direction: column;
}

.page-header {
  display: flex;
  background: #fff;
  z-index: 1;
  width: 100%;
  border-bottom: solid 1px transparent;
  padding: 12px 24px;
  box-sizing: border-box;
  align-items: center;
  transition: all 0.15s ease;

  &.scrolled {
    border-bottom: solid 1px #E0E2E7;
  }

  .editor-toolbar {
    flex: 0 0 auto;
    margin: 0 auto;
    display: flex;
    align-items: center;
    font-size: 12px;
  }

  .editor-context-menu {
    flex: 0 0 auto;
    margin-left: auto;

    .menu-btn {
      padding: 12px;
    }
  }

}

.page-history {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 50;
  width: 256px;
  height: 100vh;
  background: #fafafa;
  flex: 0 0 auto;
  overflow-y: scroll;
}

.page-editor {
  margin: 0 auto;
  padding: 96px 0;
  flex: 1 1 auto;
  overflow-y: scroll;
  width: 100%;
  position: relative;
}

.menu-separator {
  width: 1px;
  height: 24px;
  background: #E0E2E7;
  margin: 0 8px;
  display: inline-block;
}

.menu {
  background: #fff;
  color: #333;
  border: none;
  padding: 8px;
  outline: none;
  border-radius: 2px;
  transition: all 0.15s ease;
  margin-right: 4px;

  .stroke-current {
    stroke: transparent;
  }

  &:last-child {
    margin-right: 0;
  }

  &:hover {
    background: #eee;
  }

  &.active, &:active {
    background: #444754;
    color: #fff;
  }

  &[disabled] {
    opacity: 0.5;
  }
}

.color-blocks {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-gap: 8px;
  padding: 24px;
}

.color-block {
  width: 24px;
  height: 24px;
  border-radius: 100%;
  transition: all 0.15s ease;

  &:hover {
    transform: scale(0.9);
  }
}

.bg-color, .text-color {
  padding: 2px 4px;
  box-sizing: border-box;
  font-size: 12px;
}

.bg-color-display, .text-color-display {
  width: 12px;
  height: 12px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
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

  &:hover {
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

.action-separator {
  @apply my-1;
  height: 1px;
  background: theme("colors.gray.100");
}

.editor-title-input {
  color: #202225;
  font-weight: bold;
  font-size: 24px;
  line-height: 29px;
  outline: none;
  border: none;
  margin-bottom: 24px;
  display: block;
  width: 100%;
  resize: none;
  height: auto;
}

.paper {
  width: 704px;
  margin: auto;
}

.bubble {
  position: absolute;
  z-index: 5;
  .bubble-wrap {
    background: #FFFFFF;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.16);
    border-radius: 4px;
    padding: 4px;
    max-width: 100%;
    font-size: 12px;
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    overflow: visible;
  }
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
  color: #2C2B35;

  &.resize-cursor {
    cursor: col-resize;
  }

  .novadoc-title {
    font-size: 2.4em;
  }

  h1, h2, h3 {
    margin: 24px 0;
  }

  h1 {
    font-weight: bold;
    font-size: 28px;
    line-height: 33px;
  }

  h2 {
    font-weight: bold;
    font-size: 22px;
    line-height: 26px;
  }

  h3 {
    font-weight: bold;
    font-size: 18px;
    line-height: 21px;
  }

  p {
    font-size: 16px;
  }

  ul {
    list-style: disc;
    margin-left: 18px;
  }

  ol {
    list-style: decimal;
    margin-left: 18px;
  }

  ul, ol {
    li {
      line-height: 24px;
      margin-top: 16px;
      margin-bottom: 16px;
      margin-left: 26px;
      padding-left: 18px;
    }
  }

  a {
    text-decoration: underline;
    color: #146493;
  }

  blockquote {
    background: #F8F8FB;
    border-radius: 12px;
    border: none;
    padding: 16px 12px;
    position: relative;
    margin: 24px 0;

    > p:first-child {
      margin-top: 0;
    }
  }

  code {
    padding: 2px;
    background: #2C2B35;
    border-radius: 4px;
    font-size: 0.8em;
    color: #fff;
  }

  p:first-child, h1:first-child, h2:first-child, h3:first-child, h4:first-child, h5:first-child, h6:first-child {
    margin-top: inherit;
  }

  .novadoc-divider {
    border: 1px dashed #AAB1C5;
    margin: 24px 0;
  }

  table {
    width: 100%;
    max-width: 800px;
    margin: 48px 0;
    position: relative;
    border-spacing: 0;
    border-collapse: collapse;
    border-radius: 4px;
    border-style: hidden;
    box-shadow: 0 0 0 1px #DEE2EE;

    tr {
      td {
        border: solid 1px #DEE2EE;
        padding: 8px;
        position: relative;

        &.selectedCell {
          background: #def;
        }
      }
    }

    tbody tr td {
      border-top: none;
      border-right: none;
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

  .novadoc-mention {
    color: #146493;
    font-weight: bolder;
    padding: 4px;
    border-radius: 4px;

    &.ProseMirror-selectednode {
      background: #ddd;
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
