<template>
  <div class="simple-editor" :class="{ editable }" ref="simpleEditorContainer">
    <EditorMenuBubble
      :editor="editor"
      v-slot="{ isActive, commands, menu, getMarkAttrs }"
    >
      <div>
        <div
          class="bubble"
          :class="{ 'is-active': true }"
          :style="`left: ${menu.left <= 210 ? menu.left - 40 : menu.left}px; bottom: ${menu.bottom}px;`"
          @mousedown.stop.prevent="consume"
        >
          <div class="bubble-wrap" v-if="canShowBubble(isActive, menu)">
            <button
              class="menu"
              :class="{ active: isActive.bold() }"
              @click="commands.bold"
              v-tippy="{ placement: 'top', arrow: true }"
              content="Bold"
            >
              <legacy-icon name="bold" viewbox="16" size="16"></legacy-icon>
            </button>
            <button
              class="menu"
              :class="{ active: isActive.italic() }"
              @click="commands.italic"
              v-tippy="{ placement: 'top', arrow: true }"
              content="Italic"
            >
              <legacy-icon name="italic" viewbox="16" size="16"></legacy-icon>
            </button>
            <button
              class="menu"
              :class="{ active: isActive.underline() }"
              @click="commands.underline"
              v-tippy="{ placement: 'top', arrow: true }"
              content="Underline"
            >
              <legacy-icon
                name="underline"
                viewbox="16"
                size="16"
              ></legacy-icon>
            </button>
            <button
              class="menu"
              :class="{ active: isActive.strike() }"
              @click="commands.strike"
              v-tippy="{ placement: 'top', arrow: true }"
              content="Strikethrough"
            >
              <span>
                <legacy-icon name="strike" viewbox="16" size="16"></legacy-icon>
              </span>
            </button>
            <button
              class="menu"
              :class="{ active: isActive.code() }"
              @click="commands.code"
              v-tippy="{ placement: 'top', arrow: true }"
              content="Inline Code"
            >
              <TerminalIcon size="16"></TerminalIcon>
            </button>
            <MenuGroup
            value="#000"
            :show-arrow="false"
            v-tippy="{ placement: 'top', arrow: true }"
            content="Text Color"
            :background="
              getMarkAttrs('text_color').color === '#EEEEEE' ||
              getMarkAttrs('text_color').color === '#F5F5F5' ||
              getMarkAttrs('text_color').color === '#FAFAFA'
                ? '#333'
                : ''
            "
          >
            <template #default>
              <legacy-icon
                name="text-color"
                viewbox="16"
                size="16"
                :style="{ color: getMarkAttrs('text_color').color }"
              ></legacy-icon>
            </template>
            <template #options="{ select, hide }">
              <div class="color-blocks text-color-blocks">
                <div
                  v-for="textColor in textColors"
                  :key="textColor.color"
                  class="color-block"
                  :style="{
                    background: textColor.color,
                    border: `solid 1px ${textColor.border}`
                  }"
                  @click="
                    select(textColor.color)
                    hide()
                    commands.text_color({ color: textColor.color })
                    hideBubble()
                  "
                >
                  <legacy-icon
                    v-if="textColor.color === getMarkAttrs('text_color').color"
                    name="checkmark3"
                    viewbox="16"
                    size="16"
                    class="check"
                    :style="{ color: blackOrWhite(textColor.color) }"
                  ></legacy-icon>
                </div>
              </div>
            </template>
          </MenuGroup>
            <MenuGroup
            value="#000"
            :show-arrow="false"
            v-tippy="{ placement: 'top', arrow: true }"
            content="Highlight Color"
            :background="
              getMarkAttrs('bg_color').color
                ? getMarkAttrs('bg_color').color
                : ''
            "
            no-margin
          >
            <template #default>
              <legacy-icon
                name="highlight"
                viewbox="16"
                size="16"
                :style="{
                  background: getMarkAttrs('bg_color').color
                    ? getMarkAttrs('bg_color').color
                    : '',
                  color: getMarkAttrs('bg_color').color
                    ? getMarkAttrs('text_color').color
                    : ''
                }"
              ></legacy-icon>
            </template>
            <template #options="{ select, hide }">
              <div class="color-combo-title">select combination</div>
              <div
                class="color-combo"
                v-for="combo in colorCombinations"
                :key="combo.background"
                :style="{ background: combo.background, color: combo.color }"
                :class="[
                  combo.class,
                  getMarkAttrs('bg_color').color === combo.background
                    ? 'active'
                    : ''
                ]"
                @click="
                  select(combo)
                  hide()
                  commands.bg_color({ color: combo.background })
                  commands.text_color({ color: combo.color })
                  hideBubble()
                "
              >
                {{ combo.name }}
              </div>
            </template>
          </MenuGroup>
            <NovadocMenuSeparator
            ></NovadocMenuSeparator>
            <MenuGroup
              :value="getMarkAttrs('link').href"
              :show-arrow="false"
              v-tippy="{ placement: 'top', arrow: true }"
              content="Link"
            >
              <template #default>
                <legacy-icon
                  name="edit2"
                  viewbox="16"
                  size="12"
                  v-if="isActive.link()"
                ></legacy-icon>
                <legacy-icon
                  v-else
                  name="link2"
                  viewbox="16"
                  size="16"
                ></legacy-icon>
              </template>
              <template #options="{ hide }">
                <NovadocLinkInput
                  @cancel="hide()"
                  @submit="
                    commands.link({ href: $event })
                    hide()
                  "
                  :value="getMarkAttrs('link').href"
                ></NovadocLinkInput>
              </template>
            </MenuGroup>
            <NovadocMenuButton
              @click="commands.link({})"
              v-if="isActive.link()"
              v-tippy="{ placement: 'top', arrow: true }"
              content="Unlink"
              no-margin
            >
              <legacy-icon name="unlink" viewbox="16" size="16"></legacy-icon>
            </NovadocMenuButton>
            <NovadocMenuSeparator
              v-if="getMarkAttrs('link').href"
            ></NovadocMenuSeparator>
            <NovadocMenuButton
              @click="openLink(getMarkAttrs('link').href)"
              v-if="isActive.link()"
              v-tippy="{ placement: 'top', arrow: true }"
              :content="getMarkAttrs('link').href"
            >
              <legacy-icon
                name="open-link"
                viewbox="16"
                size="16"
              ></legacy-icon>
            </NovadocMenuButton>
          </div>
        </div>
      </div>
    </EditorMenuBubble>

    <EditorContent
      class="editor__content"
      :editor="editor"
      @keydown.native="onKeydown"
    />
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBubble, TextSelection } from 'tiptap'
import {
  Bold,
  Italic,
  Underline,
  Strike,
  Code,
  CodeBlockHighlight,
  Link,
  Placeholder,
  History,
  HardBreak
} from 'tiptap-extensions'
import Divider from '@/views/Novadoc/Divider'
import NovadocLinkInput from '@/views/Novadoc/Menu/NovadocLinkInput'
import NovadocMenuButton from '@/views/Novadoc/Menu/NovadocMenuButton'
import NovadocMenuSeparator from '@/views/Novadoc/Menu/NovadocMenuSeparator'
import TextColor from '@/views/Novadoc/TextColor'
import BgColor from '@/views/Novadoc/BgColor'
import MenuGroup from '@/views/Novadoc/MenuGroup'

import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import bash from 'highlight.js/lib/languages/bash'

import { TerminalIcon } from 'vue-feather-icons'
import { blackOrWhite, hexToHsl } from '@/utils/colors'

export default {
  components: {
    EditorContent,
    EditorMenuBubble,
    NovadocMenuSeparator,
    NovadocMenuButton,
    NovadocLinkInput,
    MenuGroup,
    TerminalIcon
  },
  props: {
    placeholder: {
      type: String,
      default: 'Write something ...'
    },
    value: {
      type: [String, Object],
      default: () => ({})
    },
    editable: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      editor: new Editor({
        extensions: [
          new Bold(),
          new Italic(),
          new Underline(),
          new Strike(),
          new Code(),
          new CodeBlockHighlight({
            languages: {
              javascript,
              typescript,
              bash,
              xml
            }
          }),
          new TextColor(),
          new BgColor(),
          new Divider(),
          new Link(),
          new Placeholder({
            emptyEditorClass: 'is-editor-empty',
            emptyNodeClass: 'is-empty',
            emptyNodeText: 'Write something ...',
            showOnlyWhenEditable: true,
            showOnlyCurrent: true
          }),
          new History(),
          new HardBreak()
        ],
        content: null,
        editable: true
      }),
      linkUrl: null,
      linkMenuIsActive: false
    }
  },
  created () {
    this.editor.extensions.options.placeholder.emptyNodeText = this.placeholder
    this.editor.setContent(this.value)
    this.editor.setOptions({ editable: this.editable })
  },
  beforeDestroy () {
    this.editor.destroy()
  },
  methods: {
    save () {
      const content = this.editor.getJSON()
      this.$emit('save', content)
    },
    onKeydown (e) {
      if (e.shiftKey && e.keyCode === 13) {
        this.editor.commands.hard_break()
      } else if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.keyCode === 13) {
        this.editor.commands.undo()
        this.save()
      } else if (e.keyCode === 27) {
        this.$emit('reset')
      }
    },
    showLinkMenu (attrs) {
      this.linkUrl = attrs.href
      this.linkMenuIsActive = true
      this.$nextTick(() => {
        this.$refs.linkInput.focus()
      })
    },
    hideLinkMenu () {
      this.linkUrl = null
      this.linkMenuIsActive = false
    },
    setLinkUrl (command, url) {
      command({ href: url })
      this.hideLinkMenu()
    },
    consume () {
      // NOTE: Any event that want to be consumed without action should be put here
    },
    canShowBubble (isActive, menu) {
      return (
        menu.isActive &&
        !this.isTitleFocused &&
        !isActive.code_block() &&
        !isActive.divider()
      )
    },
    hideBubble () {
      const sel = this.editor.view.state.selection
      const tr = this.editor.view.state.tr
      this.editor.view.dispatch(tr.setSelection(TextSelection.create(tr.doc, sel.to)))
    },
    blackOrWhite (color) {
      return blackOrWhite(hexToHsl(color))
    },
    openLink (url) {
      window.open(url, '_blank')
    }
  },
  watch: {
    value (val) {
      this.editor.setContent(val)
    },
    editable (val) {
      this.editor.setOptions({ editable: val })
    }
  },
  computed: {
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

<style lang="postcss" scope>
.simple-editor {
  &.editable {
    @apply bg-white p-2 rounded;
    --border-opacity: 1;
    border-width: 1px;
    border-color: rgba(170,177,197,var(--border-opacity));
    min-height: 41px;

    &:focus-within {
      min-height: 75px;
      resize: none;
      box-shadow: 0 0 0 3px rgb(170 177 197 / 50%);
    }
    .ProseMirror {
      min-height: 19px;
      font-size: 14px;
    }
  }

  .ProseMirror p:first-child {
    margin-top: 0px !important;
  }
}

p.is-editor-empty:first-child::before {
  content: attr(data-empty-text);
  float: left;
  color: #a4b0c2;
  pointer-events: none;
  height: 0;
  font-size: 14px;
}

p.is-editor-empty {
  margin-top: 0px !important;
}

.bubble {
  position: absolute;
  z-index: 5;

  display: -webkit-box;
  display: flex;
  border-radius: 5px;
  padding: 0.3rem;
  margin-bottom: 0.5rem;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
  visibility: hidden;
  opacity: 0;
  -webkit-transition: opacity 0.2s, visibility 0.2s;
  transition: opacity 0.2s, visibility 0.2s;

  &.is-active {
    opacity: 1;
    visibility: visible;
  }

  .bubble-wrap {
    background: #ffffff;
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
    border: 1px solid #e0e2e7;
  }
  &:not(.white) {
    border: 2px solid transparent;
  }
  &:hover,
  &.active {
    &.white {
      border: 1px solid #bcbfc8;
    }
    &.red {
      border: 2px solid #ffb6b6;
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

.menu-separator {
  width: 1px;
  height: 24px;
  background: #e0e2e7;
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
    margin-right: 0;
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
    background: #f4f5f7;
  }

  &.active,
  &:active {
    background: #ddf3ff;
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

.bg-color,
.text-color {
  box-sizing: border-box;
  font-size: 12px;
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
