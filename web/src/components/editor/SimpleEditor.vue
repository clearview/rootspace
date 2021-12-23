<template>
  <div class="editor">
    <EditorMenuBubble
      :editor="editor"
      :keep-in-bounds="keepInBounds"
      v-slot="{ commands, isActive, menu }"
    >
      <div
        class="menububble"
        :class="{ 'is-active': menu.isActive }"
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
          :class="{ 'is-active': isActive.code() }"
          @click="commands.code"
        >
          <mono-icon name="code" />
        </button>
      </div>
    </EditorMenuBubble>

    <EditorContent class="editor__content" :editor="editor" />
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBubble } from 'tiptap'
import {
  Blockquote,
  BulletList,
  CodeBlock,
  HardBreak,
  Heading,
  ListItem,
  OrderedList,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History
} from 'tiptap-extensions'

export default {
  components: {
    EditorContent,
    EditorMenuBubble
  },
  data () {
    return {
      keepInBounds: true,
      editor: new Editor({
        extensions: [
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Link(),
          new Bold(),
          new Code(),
          new Italic(),
          new Strike(),
          new Underline(),
          new History()
        ],
        content: `
          <h2>
            Menu Bubble
          </h2>
          <p>
            Hey, try to select some text here. There will popup a menu for selecting some inline styles. <em>Remember:</em> you have full control about content and styling of this menu.
          </p>
        `
      })
    }
  },
  beforeDestroy () {
    this.editor.destroy()
  }
}
</script>

<style lang="scss" scope>
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
    -webkit-transition: opacity .2s,visibility .2s;
    transition: opacity .2s,visibility .2s;

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
        background-color: hsla(0,0%,100%,.2);
    }
}
</style>
