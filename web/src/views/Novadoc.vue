<template>
  <div class="page" ref="page">
    <header class="page-header" :class="{scrolled: pageScrolled}">
      <div class="editor-toolbar m-0 w-full" v-if="!doc">
        <ToolbarGhost active></ToolbarGhost>
      </div>
      <editor-menu-bar ref="menuBar" :editor="editor"
                       v-slot="{ commands, isActive, getMarkAttrs, getNodeAttrs, focused }"
                       v-show="doc">
        <div class="editor-toolbar">
          <MenuGroup big value="Normal Text" :disabled="!canChangeTextType(isActive, focused)"
                     v-tippy="{ placement : 'top',  arrow: true }" content="Text Style">
            <template #default>
              <div style="padding-right: 32px;">
                {{ getTextDisplayType(isActive) }}
              </div>
            </template>
            <template #options="{select, hide}">
              <MenuGroupOption @click="select('Heading 1');hide();commands.paragraph({level: 1})"
                               :active="isActive.paragraph({level: 1})">
                <template #icon>
                  H1
                </template>
                <template #label>
                  Heading 1
                </template>
              </MenuGroupOption>
              <MenuGroupOption @click="select('Heading 2');hide();commands.paragraph({level: 2})"
                               :active="isActive.paragraph({level: 2})">
                <template #icon>
                  H2
                </template>
                <template #label>
                  Heading 2
                </template>
              </MenuGroupOption>
              <MenuGroupOption @click="select('Heading 3');hide();commands.paragraph({level: 3})"
                               :active="isActive.paragraph({level: 3})">
                <template #icon>
                  H3
                </template>
                <template #label>
                  Heading 3
                </template>
              </MenuGroupOption>
              <MenuGroupOption @click="select('Normal Text');hide();commands.paragraph({level: 0})"
                               :active="isActive.paragraph({level: 0})">
                <template #icon>
                  Tt
                </template>
                <template #label>
                  Normal Text
                </template>
              </MenuGroupOption>
            </template>
          </MenuGroup>
          <div class="menu-separator"></div>
          <button class="menu menu-big" :class="{ 'active': isActive.bold() }" :disabled="!canBeBold(isActive, focused)"
                  @click="commands.bold" v-tippy="{ placement : 'top',  arrow: true }" content="Bold">
            <v-icon name="bold" viewbox="16" size="16"></v-icon>
          </button>
          <button class="menu menu-big" :class="{ 'active': isActive.italic() }" :disabled="!canBeItalic(isActive, focused)"
                  @click="commands.italic" v-tippy="{ placement : 'top',  arrow: true }" content="Italic">
            <v-icon name="italic" viewbox="16" size="16"></v-icon>
          </button>
          <button class="menu menu-big" :class="{ 'active': isActive.underline() }"
                  :disabled="!canBeUnderline(isActive, focused)"
                  @click="commands.underline" v-tippy="{ placement : 'top',  arrow: true }" content="Underline">
            <v-icon name="underline" viewbox="16" size="16"></v-icon>
          </button>
          <button class="menu menu-big" :class="{ 'active': isActive.strike() }"
                  :disabled="!canBeStrikethrough(isActive, focused)" @click="commands.strike"
                  v-tippy="{ placement : 'top',  arrow: true }" content="Strikethrough">
            <span>
              <v-icon name="strike" viewbox="16" size="16"></v-icon>
            </span>
          </button>
          <button class="menu menu-big" :class="{ 'active': isActive.code() }" :disabled="!canBeInlineCode(isActive, focused)"
                  @click="commands.code" v-tippy="{ placement : 'top',  arrow: true }" content="Inline Code">
            <TerminalIcon size="16"></TerminalIcon>
          </button>
          <div class="menu-separator"></div>
          <MenuGroup big value="Left" :disabled="!canBeAligned(isActive, focused)" v-tippy="{ placement : 'top',  arrow: true }" content="Alignment"
          no-margin>
            <template #default>
              <component :is="getalignmentIcon(getNodeAttrs('paragraph').align)" size="14" :name="getalignmentIconName(getNodeAttrs('paragraph').align)"></component>
            </template>
            <template #options="{select, hide}">
              <MenuGroupOption @click="select('Left');hide();commands.paragraph({align: 'left'})">
                <template #icon>
                  <v-icon name="align-left" viewbox="16" size="16"></v-icon>
                </template>
                <template #label>
                  Left
                </template>
              </MenuGroupOption>
              <MenuGroupOption @click="select('Center');hide();commands.paragraph({align: 'center'})">
                <template #icon>
                  <v-icon name="align-center" viewbox="16" size="16"></v-icon>
                </template>
                <template #label>
                  Center
                </template>
              </MenuGroupOption>
              <MenuGroupOption @click="select('Right');hide();commands.paragraph({align: 'right'})">
                <template #icon>
                  <v-icon name="align-right" viewbox="16" size="16"></v-icon>
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
          <MenuGroup value="#000" v-if="canBeTextColored(isActive, true)" :show-arrow="false" v-tippy="{ placement : 'top',  arrow: true }" content="Text Color"
          :background="getMarkAttrs('text_color').color ===  '#EEEEEE' || getMarkAttrs('text_color').color ===  '#F5F5F5' || getMarkAttrs('text_color').color ===  '#FAFAFA' ? '#333' : ''">
            <template #default>
              <v-icon name="text-color" viewbox="16" size="16"
                      :style="{ color: getMarkAttrs('text_color').color }"></v-icon>
            </template>
            <template #options="{select, hide}">
              <div class="color-blocks text-color-blocks">
                <div v-for="textColor in textColors" :key="textColor.color" class="color-block"
                     :style="{background: textColor.color, border: `solid 1px ${textColor.border}`}"
                     @click="select(textColor.color);hide();commands.text_color({color: textColor.color})">
                  <v-icon v-if="textColor.color === getMarkAttrs('text_color').color" name="checkmark3" viewbox="16" size="16" class="check" :style="{color: blackOrWhite(textColor.color)}"></v-icon>
                </div>
              </div>
            </template>
          </MenuGroup>
          <MenuGroup big value="#000" :disabled="!canBeBgColored(isActive, focused)" :show-arrow="false" v-tippy="{ placement : 'top',  arrow: true }" content="Highlight Color"
                     :background="getMarkAttrs('bg_color').color ? getMarkAttrs('bg_color').color : ''" no-margin>
            <template #default>
              <v-icon name="highlight" viewbox="16" size="16"
                      :style="{background: getMarkAttrs('bg_color').color ? getMarkAttrs('bg_color').color : '', color: getMarkAttrs('bg_color').color ? getMarkAttrs('text_color').color : ''}"></v-icon>
            </template>
            <template #options="{select, hide}">
              <div class="color-combo-title">
                select combination
              </div>
              <div class="color-combo" v-for="combo in colorCombinations" :key="combo.background"
              :style="{background: combo.background, color: combo.color}"
              :class="[combo.class, getMarkAttrs('bg_color').color === combo.background ? 'active' : '']" @click="select(combo);hide();commands.bg_color({color: combo.background});commands.text_color({color: combo.color})">
                {{combo.name}}
              </div>
            </template>
          </MenuGroup>
          <div class="menu-separator"></div>
          <button class="menu menu-big" :class="{ 'active': isActive.bullet_list() } "
                  :disabled="!canBeConvertedToList(isActive, focused)"
                  @click="commands.bullet_list" v-tippy="{ placement : 'top',  arrow: true }" content="Bullet List">
            <ListIcon size="16"></ListIcon>
          </button>
          <button class="menu menu-big" :class="{ 'active': isActive.ordered_list() }"
                  :disabled="!canBeConvertedToList(isActive, focused)"
                  @click="commands.ordered_list" v-tippy="{ placement : 'top',  arrow: true }" content="Numbered List">
            <v-icon name="ordered-list" viewbox="16" size="16"></v-icon>
          </button>
          <div class="menu-separator"></div>
          <button class="menu menu-big" :class="{ 'active': isActive.todo_list() }"
                  :disabled="!canBeConvertedToList(isActive, focused)"
                  @click="commands.todo_list" v-tippy="{ placement : 'top',  arrow: true }" content="Checklist">
            <CheckSquareIcon size="16"></CheckSquareIcon>
          </button>
          <button class="menu menu-big" :class="{ 'active': isActive.image() }" :disabled="!canInsertImage(isActive, focused)"
                  @click="commands.image({docId: id, spaceId: activeSpace.id})" v-tippy="{ placement : 'top',  arrow: true }" content="Image">
            <ImageIcon size="16"></ImageIcon>
          </button>
          <MenuGroup big :value="getMarkAttrs('link').href" :disabled="!canBeLinked(isActive, focused)" :show-arrow="false"
                     v-tippy="{ placement : 'top',  arrow: true }" content="Link">
            <template #default>
              <v-icon name="link2" viewbox="16" size="16"></v-icon>
            </template>
            <template #options="{ hide }">
              <NovadocLinkInput @cancel="hide()" @submit="commands.link({href: $event});hide();"></NovadocLinkInput>
            </template>
          </MenuGroup>
          <button class="menu menu-big" :class="{ 'active': isActive.reference() }" :disabled="!canInsertReference(isActive, focused)"
                  @click="insertReference(commands)" v-tippy="{ placement : 'top',  arrow: true }" content="Reference">
            <v-icon name="reference-link" viewbox="16" size="16"></v-icon>
          </button>
          <button class="menu menu-big" :class="{ 'active': isActive.divider() }" :disabled="!canInsertLine(isActive, focused)"
                  @click="commands.divider" v-tippy="{ placement : 'top',  arrow: true }" content="Horizontal line">
            <MinusIcon size="16"></MinusIcon>
          </button>
          <button class="menu menu-big" :class="{ 'active': isActive.blockquote() }"
                  :disabled="!canBeConvertedToQuote(isActive, focused)"
                  @click="commands.blockquote" v-tippy="{ placement : 'top',  arrow: true }" content="Blockquote">
            <v-icon viewbox="16" name="quote" size="16"></v-icon>
          </button>
          <button class="menu menu-big no-margin" :class="{ 'active': isActive.code_block() }"
                  :disabled="!canBeConvertedToCodeBlock(isActive, focused)"
                  @click="createCodeBlock(commands.paragraph_merger, commands.code_block)" v-tippy="{ placement : 'top',  arrow: true }" content="Code block">
            <CodeIcon size="16"></CodeIcon>
          </button>
          <div class="menu-separator"></div>
          <button
            class="menu menu-big no-margin" :disabled="!canCreateTable(isActive, focused)"
            @click="commands.createTable({rowsCount: 3, colsCount: 3, withHeaderRow: false })"
            v-tippy="{ placement : 'top',  arrow: true }" content="Table"
          >
            <v-icon name="table" viewbox="16" size="16"></v-icon>
          </button>
          <div class="menu-separator"></div>
          <button class="menu menu-big" @click="commands.undo" v-tippy="{ placement : 'top',  arrow: true }" content="Undo"
          :disabled="!canUndo()">
            <v-icon name="undo" viewbox="16" size="16"></v-icon>
          </button>
          <button class="menu menu-big" @click="commands.redo" v-tippy="{ placement : 'top',  arrow: true }" content="Redo"
          :disabled="!canRedo()">
            <v-icon name="redo" viewbox="16" size="16"></v-icon>
          </button>
        </div>
      </editor-menu-bar>
      <div class="editor-context-menu" v-show="doc">
        <div class="lock-indicator" v-if="readOnly">
          <v-icon name="lock"></v-icon>
        </div>
        <Popover :z-index="1001" :with-close="false" position="bottom-start" borderless>
          <template #default="{ hide }">
            <div class="action-line" @click="hide();showHistory()">
              <v-icon name="history" viewbox="20"></v-icon>
              <div class="action-line-text">
                History
              </div>
            </div>
            <div class="action-line" @click="hide();toggleReadOnly()">
              <v-icon name="lock"></v-icon>
              <div class="action-line-text" v-if="readOnly">
                Unlock
              </div>
              <div class="action-line-text" v-else>
                Lock
              </div>
            </div>
            <div class="action-separator"></div>
            <div class="action-line danger" @click="hide();deleteNovadoc()">
              <v-icon name="trash-archive" viewbox="16"></v-icon>
              <div class="action-line-text">
                Delete
              </div>
            </div>
          </template>
          <template #trigger="{ visible }">
            <button class="menu-btn btn btn-link" :class="{'btn-link-primary': visible}">
              <v-icon name="vertical-ellipsis" viewbox="20" size="16px"/>
            </button>
          </template>
        </Popover>
      </div>
    </header>
    <DocGhost v-if="!doc" active></DocGhost>
    <div v-show="doc" class="page-editor" ref="pageEditor">
      <div class="paper" @scroll="determineHeaderState" ref="paper" @mousedown.self="focusToEditor($event, true)">
        <editor-menu-bubble :editor="editor" v-slot="{ isActive, commands, menu, getMarkAttrs }">
          <div>
            <div class="link-bubble bubble" ref="linkBubble" v-if="!canShowBubble(isActive, menu) && isActive.link() && !isCellSelection() && !readOnly"
                 :style="getBubblePosition()" @mousedown.stop.prevent="consume">
              <div class="bubble-wrap">
                <MenuGroup :value="getMarkAttrs('link').href" :show-arrow="false">
                  <template #default>
                    <v-icon name="link-edit" viewbox="16" size="16" v-tippy="{ placement : 'top',  arrow: true }" content="Edit Link"></v-icon>
                  </template>
                  <template #options="{ hide }">
                    <NovadocLinkInput @cancel="hide()" @submit="commands.link({href: $event});hide();" :value="getMarkAttrs('link').href"></NovadocLinkInput>
                  </template>
                </MenuGroup>
                <NovadocMenuButton @click="commands.link({})" v-tippy="{ placement : 'top',  arrow: true }" content="Unlink" no-margin>
                  <v-icon name="unlink" viewbox="16" size="16"></v-icon>
                </NovadocMenuButton>
                <NovadocMenuSeparator></NovadocMenuSeparator>
                <NovadocMenuButton @click="openLink(getMarkAttrs('link').href)" v-tippy="{ placement : 'top',  arrow: true }" :content="getMarkAttrs('link').href">
                  <v-icon name="open-link" viewbox="16" size="16"></v-icon>
                </NovadocMenuButton>
              </div>
            </div>
            <div class="bubble" ref="bubble" :style="getBubblePosition()" @mousedown.stop.prevent="consume">
            <div class="bubble-wrap" v-if="canShowBubble(isActive, menu)">
              <button class="menu" :class="{ 'active': isActive.bold() }" v-if="canBeBold(isActive, true)"
                      @click="commands.bold" v-tippy="{ placement : 'top',  arrow: true }" content="Bold">
                <v-icon name="bold" viewbox="16" size="16"></v-icon>
              </button>
              <button class="menu" :class="{ 'active': isActive.italic() }" v-if="canBeItalic(isActive, true)"
                      @click="commands.italic" v-tippy="{ placement : 'top',  arrow: true }" content="Italic">
                <v-icon name="italic" viewbox="16" size="16"></v-icon>
              </button>
              <button class="menu" :class="{ 'active': isActive.underline() }" v-if="canBeUnderline(isActive, true)"
                      @click="commands.underline" v-tippy="{ placement : 'top',  arrow: true }" content="Underline">
                <v-icon name="underline" viewbox="16" size="16"></v-icon>
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
              <MenuGroup value="#000" v-if="canBeTextColored(isActive, true)" :show-arrow="false" v-tippy="{ placement : 'top',  arrow: true }" content="Text Color"
                         :background="getMarkAttrs('text_color').color ===  '#EEEEEE' || getMarkAttrs('text_color').color ===  '#F5F5F5' || getMarkAttrs('text_color').color ===  '#FAFAFA' ? '#333' : ''">
                <template #default>
                  <v-icon name="text-color" viewbox="16" size="16"
                          :style="{ color: getMarkAttrs('text_color').color }"></v-icon>
                </template>
                <template #options="{select, hide}">
                  <div class="color-blocks text-color-blocks">
                    <div v-for="textColor in textColors" :key="textColor.color" class="color-block"
                         :style="{background: textColor.color, border: `solid 1px ${textColor.border}`}"
                         @click="select(textColor.color);hide();commands.text_color({color: textColor.color})">
                      <v-icon v-if="textColor.color === getMarkAttrs('text_color').color" name="checkmark3" viewbox="16" size="16" class="check" :style="{color: blackOrWhite(textColor.color)}"></v-icon>
                    </div>
                  </div>
                </template>
              </MenuGroup>
              <MenuGroup value="#000" v-if="canBeBgColored(isActive, true)" :show-arrow="false" v-tippy="{ placement : 'top',  arrow: true }" content="Highlight Color"
              :background="getMarkAttrs('bg_color').color ? getMarkAttrs('bg_color').color : ''" no-margin>
                <template #default>
                  <v-icon name="highlight" viewbox="16" size="16"
                          :style="{background: getMarkAttrs('bg_color').color ? getMarkAttrs('bg_color').color : '', color: getMarkAttrs('bg_color').color ? getMarkAttrs('text_color').color : ''}"></v-icon>
                </template>
                <template #options="{select, hide}">
                  <div class="color-combo-title">
                    select combination
                  </div>
                  <div class="color-combo" v-for="combo in colorCombinations" :key="combo.background"
                       :style="{background: combo.background, color: combo.color}"
                       :class="combo.class" @click="select(combo);hide();commands.bg_color({color: combo.background});commands.text_color({color: combo.color})">
                    {{combo.name}}
                  </div>
                </template>
              </MenuGroup>
              <NovadocMenuSeparator v-if="canBeLinked(isActive, true)"></NovadocMenuSeparator>
              <MenuGroup :value="getMarkAttrs('link').href" :show-arrow="false" v-tippy="{ placement : 'top',  arrow: true }" content="Link"
                v-if="canBeLinked(isActive, true)">
                <template #default>
                  <v-icon name="edit2" viewbox="16" size="12" v-if="isActive.link()"></v-icon>
                  <v-icon v-else   name="link2" viewbox="16" size="16"></v-icon>
                </template>
                <template #options="{ hide }">
                  <NovadocLinkInput @cancel="hide()" @submit="commands.link({href: $event});hide();" :value="getMarkAttrs('link').href"></NovadocLinkInput>
                </template>
              </MenuGroup>
              <NovadocMenuButton @click="commands.link({})" v-if="isActive.link()"  v-tippy="{ placement : 'top',  arrow: true }" content="Unlink"
                                 no-margin>
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
                  @keyup="debouncedSaveTitleOnly" @keypress.enter="handleTitleEnter" :readonly="readOnly"></textarea>
        <hr class="title-separator">
        <EditorContent key="editor" v-show="!isPreviewing" :editor="editor" @mousedown.native="isMouseDown = true"></EditorContent>
        <EditorContent key="preview" class="preview" v-show="isPreviewing" :editor="previewEditor"></EditorContent>
      </div>
      <div class="page-history" v-if="isHistoryVisible" @mousedown.stop.prevent="consume">
        <DocHistory ref="docHistory" :doc="doc" :preview="preview" :id="id" @close="closeHistory" @preview="showPreview"
                    @restore="restore"></DocHistory>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import {
  undoDepth,
  redoDepth
} from 'prosemirror-history'
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
import xml from 'highlight.js/lib/languages/xml'
import bash from 'highlight.js/lib/languages/bash'
import ButtonSwitch from '@/components/ButtonSwitch'

import * as encoding from 'lib0/encoding.js'
import * as decoding from 'lib0/decoding.js'
import { WebsocketProvider } from 'y-websocket'
import * as Y from 'yjs'

import CollaborationExtension from './Novadoc/CollaborationExtension'
import Novaschema from '@/views/Novadoc/Novaschema.js'

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
import Reference from '@/views/Novadoc/Reference/Reference'
import TextColor from '@/views/Novadoc/TextColor'
import BgColor from '@/views/Novadoc/BgColor'
import DocHistory from '@/views/Document/DocHistory'
import NovadocLinkInput from '@/views/Novadoc/Menu/NovadocLinkInput'
import NovadocMenuButton from '@/views/Novadoc/Menu/NovadocMenuButton'
import NovadocMenuSeparator from '@/views/Novadoc/Menu/NovadocMenuSeparator'
import ParagraphMerger from '@/views/Novadoc/ParagraphMerger'
import DocGhost from '@/components/DocGhost'
import ToolbarGhost from '@/components/ToolbarGhost'
import { blackOrWhite, hexToHsl } from '@/utils/colors'

const wsMessageType = {
  authenticate: 10,
  unauthenticated: 11,
  unauthorized: 12,
  wait: 13,
  initCollaboration: 14,
  restore: 15
}

export default {
  mixins: [SpaceMixin, PageMixin],
  components: {
    ToolbarGhost,
    DocGhost,
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
    const debouncedSaveTitleOnly = debounce(() => {
      this.saveTitleOnly(this.title)
    }, 1000)
    return {
      lengthChecked: false,
      provider: null,
      editor: null,
      previewEditor: null,
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
      pageScrolled: false,
      isBubbleFocused: false,
      isTitleFocused: false,
      nodeNameChangesListener: null,
      isMouseDown: false,
      isPreviewing: false
    }
  },
  beforeDestroy () {
    this.destroyProvider()
    this.destroyEditor()
  },
  async mounted () {
    this.listenForNodeNameChanges()
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
      blackOrWhite (color) {
        return blackOrWhite(hexToHsl(color))
      },
      createCodeBlock (merger, coder) {
        merger({ command: coder })
      },
      consume () {
        // NOTE: Any event that want to be consumed without action should be put here
      },
      canUndo () {
        return undoDepth(this.editor.state) > 1
      },
      canRedo () {
        return redoDepth(this.editor.state) > 0
      },
      destroyProvider () {
        if (this.provider) {
          this.provider.destroy()
        }
      },
      destroyEditor () {
        if (this.editor) {
          this.editor.destroy()
        }
        if (this.previewEditor) {
          this.previewEditor.destroy()
        }
      },
      initProvider () {
        const wsProviderUrl = process.env.VUE_APP_YWS_URL

        if (!wsProviderUrl) {
          console.log('process.env.VUE_APP_YWS_URL is missing')
        }

        this.provider = new WebsocketProvider(wsProviderUrl, 'doc_' + this.id, this.ydoc)
        this.provider.awareness.setLocalStateField('user', {
          color: '#333',
          name: this.currentUser.firstName
        })

        const wsAuthenticate = () => {
          const encoder = encoding.createEncoder()
          encoding.writeVarUint(encoder, wsMessageType.authenticate)
          encoding.writeVarString(encoder, this.$store.state.auth.token)
          this.provider.ws.send(encoding.toUint8Array(encoder))
        }

        const onConnecting = () => {
          const providerOnMessage = this.provider.ws.onmessage
          const providerOnOpen = this.provider.ws.onopen

          this.provider.ws.onmessage = event => {
            const decoder = decoding.createDecoder(new Uint8Array(event.data))
            const messageType = decoding.readVarUint(decoder)

            switch (messageType) {
              case wsMessageType.unauthenticated:
                // notify user
                break
              case wsMessageType.unauthorized:
                // notify user
                break
              case 'wait':
                // wait next message
                break
              case wsMessageType.initCollaboration:
                this.provider.ws.onmessage = event => {
                  const decoder = decoding.createDecoder(new Uint8Array(event.data))
                  const messageType = decoding.readVarUint(decoder)

                  if (messageType === wsMessageType.restore) {
                    // notify user
                    this.closeHistory()
                    this.initEditor()
                    return
                  }

                  // skip our custom messages, don't pass them to yjs to handle
                  if (messageType >= 10) {
                    return
                  }

                  providerOnMessage(event)
                }
                providerOnOpen()
                break
              default:
                break
            }
          }

          this.provider.ws.onopen = () => {
            wsAuthenticate()
          }
        }

        this.provider.on('status', ({ status }) => {
          if (status === 'connecting') {
            onConnecting()
          }
        })

        onConnecting()
      },
      initEditor () {
        this.destroyProvider()
        this.destroyEditor()
        this.doBindState = true

        this.ydoc = this.ydoc = new Y.Doc()
        this.initProvider()

        this.editor = new Editor({
          editable: !this.readOnly,
          extensions: [
            new Novaschema(),
            new ParagraphMerger(),
            new Reference('#', this.fetchReferences),
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
                bash,
                xml
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
            new TableMenu(),
            new CollaborationExtension(this.provider, this.ydoc.getXmlFragment('prosemirror'))
          ],
          emptyDocument: {
            type: 'doc',
            content: []
          }
        })

        this.previewEditor = new Editor({
          editable: false,
          extensions: [
            new Novaschema(),
            new ParagraphMerger(),
            new Reference('#', this.fetchReferences),
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
                bash,
                xml
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
            new Table({
              resizable: true
            }),
            new TableHeader(),
            new TableCell(),
            new TableRow(),
            new TableMenu()
          ],
          emptyDocument: {
            type: 'doc',
            content: []
          }
        })
      },
      listenForNodeNameChanges () {
        this.nodeNameChangesListener = this.$store.subscribe(async (mutation) => {
          if (mutation.type === 'tree/setList') {
            const referencedNode = mutation.payload.find(
              node => node.type === 'doc' && node.contentId.toString() === this.id.toString()
            )
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
        const offsetTop = 36
        if (this.$refs.pageEditor) {
          const left = coords.left - this.$refs.pageEditor.offsetLeft - this.$refs.pageEditor.offsetParent.offsetLeft
          return {
            left: left + 'px',
            top: coords.top - offsetTop - this.$refs.pageEditor.offsetTop + this.$refs.paper.scrollTop + 'px'
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
        if (isActive.paragraph({ level: 0 }) && focused && !this.readOnly) {
          return true
        }
      },
      insertReference (commands) {
        commands.showReference()
      },
      canInsertReference (isActive, focused) {
        if (isActive.paragraph({ level: 0 }) && focused && !this.readOnly) {
          return true
        }
      },
      canInsertLine (isActive, focused) {
        if (isActive.paragraph({ level: 0 }) && focused && !this.readOnly) {
          return true
        }
      },
      canBeLinked (isActive, focused) {
        if (isActive.paragraph({ level: 0 }) && focused && !this.readOnly) {
          return true
        }
      },
      canBeBold (isActive, focused) {
        if (isActive.paragraph({ level: 0 }) && focused && !this.readOnly) {
          return true
        }
        if (this.isCellSelection() && focused && !this.readOnly) {
          return true
        }
      },
      canBeItalic (isActive, focused) {
        if (isActive.paragraph({ level: 0 }) && focused && !this.readOnly) {
          return true
        }
        if (this.isCellSelection() && focused && !this.readOnly) {
          return true
        }
      },
      canBeUnderline (isActive, focused) {
        if (isActive.paragraph({ level: 0 }) && focused && !this.readOnly) {
          return true
        }
        if (this.isCellSelection() && focused && !this.readOnly) {
          return true
        }
      },
      canBeStrikethrough (isActive, focused) {
        if (isActive.paragraph({ level: 0 }) && focused && !this.readOnly) {
          return true
        }
        if (this.isCellSelection() && focused && !this.readOnly) {
          return true
        }
      },
      canBeInlineCode (isActive, focused) {
        if (isActive.paragraph({ level: 0 }) && focused && !this.readOnly) {
          return true
        }
      },
      canBeAligned (isActive, focused) {
        if (isActive.paragraph() && focused && !this.readOnly) {
          return true
        }
      },
      canBeTextColored (isActive, focused) {
        if (isActive.paragraph() && focused && !this.readOnly) {
          return true
        }
        if (this.isCellSelection() && focused && !this.readOnly) {
          return true
        }
      },
      canBeBgColored (isActive, focused) {
        if (isActive.paragraph() && focused && !this.readOnly) {
          return true
        }
        if (this.isCellSelection() && focused && !this.readOnly) {
          return true
        }
      },
      canBeConvertedToList (isActive, focused) {
        if ((isActive.paragraph({ level: 0 }) || isActive.bullet_list() || isActive.ordered_list() || isActive.todo_list()) && focused && !this.readOnly) {
          return true
        }
      },
      canBeConvertedToQuote (isActive, focused) {
        if (isActive.paragraph({ level: 0 }) && focused && !this.readOnly) {
          return true
        }
      },
      canBeConvertedToCodeBlock (isActive, focused) {
        if ((isActive.paragraph({ level: 0 }) || isActive.code_block()) && focused && !this.readOnly) {
          return true
        }
      },
      canChangeTextType (isActive, focused) {
        if (isActive.paragraph() && !isActive.bullet_list() && !isActive.ordered_list() && !isActive.todo_list() && focused && !this.readOnly) {
          return true
        }
      },
      canCreateTable (isActive, focused) {
        if (isActive.paragraph({ level: 0 }) && focused && !this.readOnly && !isActive.table()) {
          return true
        }
      },
      isCellSelection () {
        if (this.editor && this.editor.state.selection.$anchorCell && this.editor.state.selection.$headCell) {
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
      getalignmentIconName (align) {
        switch (align) {
          case 'left':
            return 'align-left'
          case 'center':
            return 'align-center'
          case 'right':
            return 'align-right'
          case 'justify':
            return null
        }
        return 'align-left'
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
      focusToEditor ($evt, force = false) {
        if (this.editor) {
          if (this.title.trim().length === 0) {
            this.$refs.title.focus()
          } else if (!this.editor.state.selection.empty && this.editor.state.selection.to !== this.editor.state.selection.from && !force) {
            this.editor.focus()
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
          this.title = res.data.title.trim()
          this.readOnly = res.data.isLocked
          this.setSlug(res.data.slug)
          // Phantom emptiness detected
          if (this.title.charCodeAt(0) === 1 && this.title.charCodeAt(1) === 2) {
            this.pageTitle = 'Untitled'
            this.title = ''
            this.$refs.title.focus()
          }
          if (!this.pageReady) {
            await this.activateSpace(res.data.spaceId)
          }
          this.autoResizeTitle()

          if (this.title.trim().length === 0) {
            this.$nextTick(() => {
              this.$refs.title.focus()
            })
          }

          this.initEditor()
        }
      },
      autoResizeTitle () {
        this.$nextTick(() => {
          this.$refs.title.style.height = '1px'
          const height = this.$refs.title.scrollHeight
          if (height === 0) {
            this.$refs.title.style.height = '29px'
          } else {
            this.$refs.title.style.height = height + 'px'
          }
        })
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
            this.setSlug(res.data.data.slug)
            if (data.title) {
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
          }
          this.loading = false
        } catch (err) {
          this.loading = false
        }
      },
      async toggleReadOnly () {
        this.readOnly = !this.readOnly
        this.isHistoryVisible = false
        await this.createUpdateDocument({
          isLocked: this.readOnly
        })
        if (this.readOnly) {
          this.showPreview(null)
        } else {
          this.closeHistory()
        }
      },
      showHistory () {
        this.preview = null
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
      restore (revision) {
        const encoder = encoding.createEncoder()
        encoding.writeVarUint(encoder, wsMessageType.restore)
        encoding.writeVarUint(encoder, revision.id)

        this.provider.ws.send(encoding.toUint8Array(encoder))
      },
      showPreview (revision) {
        this.isPreviewing = true
        if (!revision) {
          this.preview = {
            id: null,
            content: this.editor.getJSON()
          }
        } else {
          this.preview = revision
        }
        this.previewEditor.setContent(this.preview.content)
      },
      closeHistory () {
        if (this.editor) {
          this.isHistoryVisible = false
          this.isPreviewing = false
          this.editor.setOptions({
            editable: !this.readOnly
          })
        }
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
        return !this.readOnly && menu.isActive && !this.isTitleFocused && !isActive.code_block() && !isActive.image() &&
          !isActive.table() && !isActive.divider() && !this.isMouseDown
      },
      openLink (url) {
        window.open(url, '_blank')
      },
      listenForDocumentMouseUp () {
        document.addEventListener('mouseup', this.releaseMouseDown)
      },
      releaseMouseDown () {
        this.isMouseDown = false
      },
      setSlug (slug) {
        if (this.$route.params.slug !== slug) {
          this.$router.replace({
            params: {
              slug: slug || 'Untitled'
            }
          }).catch(e => {
            return e
            // Consume redundant error
          })
        }
      }
    },
  watch: {
    id: {
      immediate: true,
      async handler () {
        this.closeHistory()
        await this.load()
        await this.$store.dispatch('tree/fetch', { spaceId: this.activeSpace.id })
        if (!this.pageReady) {
          await this.activateSpace(this.activeSpace.id)
        }
        this.pageReady = true
      }
    },
    title (newTitle) {
      this.autoResizeTitle()
      const id = this.id
      this.$store.commit('tree/updateNode', {
        compareFn (node) {
          return node.type === 'doc' && node.contentId.toString() === id.toString()
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
        if (this.editor) {
          this.editor.setOptions({
            editable: !this.readOnly
          })
        }
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
        { border: 'transparent', color: '#212121' },
        { border: 'transparent', color: '#424242' },
        { border: 'transparent', color: '#616161' },
        { border: 'transparent', color: '#757575' },
        { border: 'transparent', color: '#9E9E9E' },

        { border: 'transparent', color: '#CF3C3C' },
        { border: 'transparent', color: '#B0611A' },
        { border: 'transparent', color: '#9C3DBF' },
        { border: 'transparent', color: '#1D8449' },
        { border: 'transparent', color: '#3467CE' }
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
    },
    colorCombinations () {
      return [
        {
          border: '#E0E2E7',
          color: '#2C2B35',
          background: '#FFFFFF',
          activeBorder: '#E0E2E7',
          name: 'Default Example',
          class: 'white'
        },
        {
          border: 'transparent',
          color: '#D64141',
          background: '#FFF3F3',
          activeBorder: '#FFB6B6',
          name: 'Red Example',
          class: 'red'
        },
        {
          border: 'transparent',
          color: '#2C2B35',
          background: '#FEFFBA',
          activeBorder: '#E1E26F',
          name: 'Yellow Example',
          class: 'yellow'
        },
        {
          border: 'transparent',
          color: '#2C2B35',
          background: '#FFEBD8',
          activeBorder: '#FFC391',
          name: 'Orange Example',
          class: 'orange'
        },
        {
          border: 'transparent',
          color: '#2C2B35',
          background: '#FFE4F3',
          activeBorder: '#FFC2E4',
          name: 'Pink Example',
          class: 'pink'
        },
        {
          border: 'transparent',
          color: '#2C2B35',
          background: '#E1F8FF',
          activeBorder: '#93D3E7',
          name: 'Blue Example',
          class: 'blue'
        },
        {
          border: 'transparent',
          color: '#2C2B35',
          background: '#E1FFBC',
          activeBorder: '#B8EA7C',
          name: 'Green Example',
          class: 'green'
        }
      ]
    }
  }

}
</script>

<style lang="postcss" scoped>

.color-combo {
  padding: 6px;
  border-radius: 4px;
  border: solid 1px transparent;
  font-weight: bold;
  font-size: 12px;
  line-height: 14px;
  margin: 16px 8px;
  width: 160px;

  &.white {
    border: 1px solid #E0E2E7;
  }
  &:not(.white){
    border: 2px solid transparent;
  }
  &:hover, &.active {
    &.white {
      border: 1px solid #bcbfc8;
    }
    &.red {
      border: 2px solid #FFB6B6;
    }
    &.yellow {
      border: 2px solid #c7c879;
    }
    &.orange {
      border: 2px solid #dbbc9e;
    }
    &.pink {
      border: 2px solid #bc8aa6;
    }
    &.blue {
      border: 2px solid #86b3c1;
    }
    &.green {
      border: 2px solid #b0d287;
    }
  }
}
.page {
  position: relative;
  display: flex;
  width: 0;
  flex: 1 1 auto;
  flex-direction: column;
}

.page-header {
  user-select: none;
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
    display: flex;
    align-items: center;

    .lock-indicator {
      border-radius: 4px;
      background: #FFE0E0;
      color: #D64141;
      padding: 8px;
      margin-right: 8px;
    }

    .popover-trigger {
      .menu-btn {
        padding: 8px;
        height: auto;
      }
      &.show {
        .menu-btn {
          color: #146493;
          background: #DDF3FF;
          box-shadow: none;
          .stroke-current {
            color: #146493;
          }
        }
      }
    }
  }

}

.page-history {
  width: 304px;
  height: 100%;
  background: #F8F8FB;
  flex: 0 0 auto;
  display: flex;
}

.page-editor {
  margin: 0 auto;
  flex: 1 1 auto;
  height: 0;
  width: 100%;
  position: relative;
  display: flex;
}

.paper {
  margin: auto;
  flex: 1 1 auto;
  height: 100%;
  padding: 96px 0;
  overflow-y: scroll;
  position: relative;
}

.menu-separator {
  width: 1px;
  height: 24px;
  background: #E0E2E7;
  margin: 0 8px;
  margin-block: auto;
  display: inline-block;
}

.menu {
  background: #fff;
  color: #333;
  border: none;
  padding: 4px;
  outline: none;
  border-radius: 4px;
  transition: all 0.15s ease;
  margin-right: 4px;

  &.no-margin {
    margin-right: 0
  }

  &-big {
    padding: 8px;
  }

  .stroke-current {
    stroke: transparent;
  }

  &:last-child {
    margin-right: 0;
  }

  &:hover {
    background: #F4F5F7;
  }

  &.active, &:active {
    background: #DDF3FF;
    color: #146493;
  }

  &[disabled] {
    opacity: 0.5;
  }
}

.color-blocks {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 8px;
  padding: 24px;
}

.color-block {
  width: 24px;
  height: 24px;
  border-radius: 100%;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  .check {

  }

  &:hover {
    transform: scale(0.9);
  }
}

.bg-color, .text-color {
  //padding: 2px 4px;
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
  font-weight: normal;
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
  padding: 0 16vw;
}

.bubble {
  position: absolute;
  z-index: 5;
  .bubble-wrap {
    background: #FFFFFF;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.16);
    border-radius: 4px;
    padding: 4px;
    box-sizing: border-box;
    max-width: 100%;
    font-size: 12px;
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    overflow: visible;
  }
}

.title-separator {
  border: 1px solid #EDEFF3;
  margin: 24px 16vw;
}

.color-combo-title {
  margin: 20px 8px 16px 8px;
  font-weight: bold;
  font-size: 10px;
  line-height: 12px;
  text-transform: uppercase;
  color: #444754;
}
</style>
<style lang="postcss">
.ProseMirror {
  margin: auto;
  padding: 0 16vw 128px 16vw;
  outline: none;
  -moz-user-select: text;
  -khtml-user-select: text;
  -webkit-user-select: text;
  -o-user-select: text;

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
    margin: 0;
  }

  h1 {
    font-weight: 700;
    font-size: 30px;
    line-height: 36px;
    margin-top: 40px;
  }

  h2 {
    font-weight: 700;
    font-size: 24px;
    line-height: 29px;
    margin-top: 32px;
  }

  h3 {
    font-weight: 700;
    font-size: 20px;
    line-height: 24px;
    margin-top: 24px;
  }

  p {
    font-size: 16px;
    line-height: 20px;
    margin-top: 16px;
    font-weight: 400;
    & + p {
      margin-top: 8px;
    }
  }

  br {
    height: 24px;
  }

  ul {
    list-style: disc;
    ul {
      list-style: circle;
    }
  }

  ol {
    list-style: decimal;
  }

  ul {
    li {
      line-height: 19px;
      margin-top: 8px;
      margin-bottom: 8px;
      margin-left: 24px;
      padding-left: 8px;
    }
  }

  ol {
    li {
      line-height: 19px;
      margin-top: 8px;
      margin-bottom: 8px;
      margin-left: 24px;
      padding-left: 8px;
      li {
        margin-left: 24px;
      }
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

  table {
    width: 100%;
    max-width: 100%;
    margin: 48px 0;
    border-spacing: 0;
    border-collapse: collapse;
    border-radius: 4px;
    border-style: hidden;
    box-shadow: 0 0 0 1px #DEE2EE;
    position: relative;

    &.striped:not(.deletion) tr:nth-of-type(2n) td {
      background: #F4F5F7;
    }

    &.deletion {
      box-shadow: 0 0 0 1px #D64141;
      tr{
        background: #FFE0E0;
        td {
          border: 1px solid #D64141;
          border-top: none;
        }
      }
    }

    p {
      font-size: 14px;
      line-height: 17px;
      font-weight: 400;
    }

    tr {
      &:hover td {
        background: #F4F5F7;
      }
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
    margin-left: 0;
  }

  li[data-type="todo_item"] {
    display: flex;
    flex-direction: row;
    margin: 8px 0;

    & {
      margin-bottom: 0;
    }
  }

  .todo-checkbox {
    border: 1px solid #AAB1C5;
    height: 20px;
    width: 20px;
    box-sizing: border-box;
    margin-right: 10px;
    margin-top: 2px;
    user-select: none;
    -webkit-user-select: none;
    cursor: pointer;
    border-radius: 6px;
    background-color: transparent;
    transition: 0.4s background;
  }

  .todo-content {
    flex: 1;

    &[contenteditable='true']::before {
      content: none;
    }

    > p:last-of-type {
      margin-bottom: 0;
    }

    > ul[data-type="todo_list"] {
      margin: 0;
    }
  }

  li[data-done="true"] {
    > .todo-content {
      > p {
        text-decoration: line-through;
        opacity: 0.85;
        color: #777B81;
      }
    }

    > .todo-checkbox {
      border: 1px solid #8CD5FF;
      background-color: #8CD5FF;
      position: relative;
      &::before {
        position: absolute;
        content: '';
        display: block;
        width: 12px;
        height: 6px;
        border-left: solid 2px  #2C2B35;
        border-bottom: solid 2px  #2C2B35;
        top: 5px;
        left: 4px;
        transform: rotate(-45deg);
      }
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
    padding: 16px;
    background: #1c1c1d;
    border-radius: 12px;
    font-size: 16px;
    color: #e5e4ec;
    margin: 12px 0;

    .hljs {
      display: block;
      overflow-x: auto;
      padding: 0.5em;
      background: #F8F8FB;
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
      color: #de3f79;
    }

    .hljs-string {
      color: #edd70b;
    }
    .hljs-attr {
      color: #93d128;
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
