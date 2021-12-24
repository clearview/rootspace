<template>
  <div class="simple-editor" :class="{ editable }">
    <EditorMenuBubble :editor="editor" v-slot="{ commands, isActive, getMarkAttrs, menu }">
      <div
        class="menububble"
        :class="{ 'is-active': menu.isActive && editable }"
        :style="`left: ${menu.left}px; bottom: ${menu.bottom}px;`"
      >
        <button
          class="menububble__button"
          :class="{ 'is-active': isActive.bold() }"
          @click="commands.bold"
        >
          <mono-icon name="bold" />
        </button>

        <button
          class="menububble__button"
          :class="{ 'is-active': isActive.italic() }"
          @click="commands.italic"
        >
          <mono-icon name="italic" />
        </button>

        <button
          class="menububble__button"
          :class="{ 'is-active': isActive.underline() }"
          @click="commands.underline"
        >
          <mono-icon name="underline" />
        </button>

        <button
          class="menububble__button"
          :class="{ 'is-active': isActive.strike() }"
          @click="commands.strike"
        >
          <mono-icon name="strikethrough" />
        </button>

        <button
          class="menububble__button"
          :class="{ 'is-active': isActive.code() }"
          @click="commands.code"
        >
          <mono-icon name="code" />
        </button>

        <form
          class="menububble__form"
          v-if="linkMenuIsActive"
          @submit.prevent="setLinkUrl(commands.link, linkUrl)"
        >
          <input
            class="menububble__input"
            type="text"
            v-model="linkUrl"
            placeholder="https://"
            ref="linkInput"
            @keydown.esc="hideLinkMenu"
          />
          <button
            class="menububble__button"
            @click="setLinkUrl(commands.link, null)"
            type="button"
          >
            <mono-icon name="trash" />
          </button>
        </form>

        <template v-else>
          <button
            class="menububble__button"
            @click="showLinkMenu(getMarkAttrs('link'))"
            :class="{ 'is-active': isActive.link() }"
          >
            <mono-icon name="link" />
          </button>
        </template>
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
import { Editor, EditorContent, EditorMenuBubble } from 'tiptap'
import {
  Bold,
  Italic,
  Underline,
  Strike,
  Code,
  Link,
  Placeholder
} from 'tiptap-extensions'

export default {
  components: {
    EditorContent,
    EditorMenuBubble
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
          new Link(),
          new Placeholder({
            emptyEditorClass: 'is-editor-empty',
            emptyNodeClass: 'is-empty',
            emptyNodeText: 'Write something ...',
            showOnlyWhenEditable: true,
            showOnlyCurrent: true
          })
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
      if ((e.metaKey || e.ctrlKey) && e.keyCode === 13) {
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
    }
  },
  watch: {
    value (val) {
      this.editor.setContent(val)
    },
    editable (val) {
      this.editor.setOptions({ editable: val })
    }
  }
}
</script>

<style lang="postcss" scope>
.simple-editor {
  &.editable {
    @apply bg-white border-secondary border-2 p-2 rounded-md;

    .ProseMirror {
      min-height: 41px;

      &.ProseMirror-focused {
        /* @apply p-2 -m-2;
        min-height: 75px;
        box-shadow: 0 1px 3px 0 rgb(0 0 0 / 10%), 0 1px 2px 0 rgb(0 0 0 / 6%); */
      }
    }
  }

  .ProseMirror p:first-child {
    margin-top: 0px !important;
  }
}

p.is-editor-empty:first-child::before {
  content: attr(data-empty-text);
  float: left;
  color: #aaa;
  pointer-events: none;
  height: 0;
  font-size: 14px;
}

p.is-editor-empty {
  margin-top: 0px !important;
}

.menububble {
  position: absolute;
  display: -webkit-box;
  display: flex;
  z-index: 20;
  background: #000;
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
}

.menububble__button {
  display: -webkit-inline-box;
  display: inline-flex;
  background: transparent;
  border: 0;
  color: #fff;
  padding: 0.2rem 0.5rem;
  margin-right: 0.2rem;
  border-radius: 3px;
  cursor: pointer;

  &.is-active {
    background-color: hsla(0, 0%, 100%, 0.2);
  }
}
</style>
