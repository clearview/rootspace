<template>
  <div class="prose-input" :class="{readOnly}">
    <header class="header" v-if="!readOnly">
      <div class="menu">
        <editor-menu-bar ref="menuBar" :editor="editor"
                         v-slot="{ commands, isActive, getMarkAttrs, /*getNodeAttrs, focused*/ }">
          <div class="menu-bar">
            <NovadocMenuButton @click="commands.bold" :active="isActive.bold()">
              <legacy-icon name="bold" viewbox="16" size="16"></legacy-icon>
            </NovadocMenuButton>
            <NovadocMenuButton @click="commands.italic" :active="isActive.italic()">
              <legacy-icon name="italic" viewbox="16" size="16"></legacy-icon>
            </NovadocMenuButton>
            <NovadocMenuButton @click="commands.underline" :active="isActive.underline()">
              <legacy-icon name="underline" viewbox="16" size="16"></legacy-icon>
            </NovadocMenuButton>
            <NovadocMenuButton @click="commands.strike" :active="isActive.strike()">
              <legacy-icon name="strike" viewbox="16" size="16"></legacy-icon>
            </NovadocMenuButton>

            <MenuGroup :value="getMarkAttrs('link').href"  :show-arrow="false"
                       v-tippy="{ placement : 'top',  arrow: true }" content="Link" v-if="!isActive.link()">
              <template #default>
                <legacy-icon name="link2" viewbox="16" size="16"></legacy-icon>
              </template>
              <template #options="{ hide }">
                <NovadocLinkInput @cancel="hide()" @submit="commands.link({href: $event});hide();"></NovadocLinkInput>
              </template>
            </MenuGroup>

            <NovadocMenuButton @click="commands.link({})" :active="isActive.link()" v-if="isActive.link()">
              <legacy-icon name="unlink" viewbox="16" size="16"></legacy-icon>
            </NovadocMenuButton>

            <NovadocMenuButton @click="commands.blockquote" :active="isActive.blockquote()">
              <legacy-icon viewbox="16" name="quote" size="16"></legacy-icon>
            </NovadocMenuButton>
            <NovadocMenuButton @click="commands.code" :active="isActive.code()">
              <TerminalIcon size="16"></TerminalIcon>
            </NovadocMenuButton>

            <NovadocMenuButton @click="commands.bullet_list" :active="getCurrentActiveNode(2) === 'bullet_list'">
              <ListIcon size="16"></ListIcon>
            </NovadocMenuButton>
            <NovadocMenuButton @click="commands.ordered_list" :active="getCurrentActiveNode(2) === 'ordered_list'">
              <legacy-icon name="ordered-list" viewbox="16" size="16" class="fill-as-stroke"></legacy-icon>
            </NovadocMenuButton>
          </div>
        </editor-menu-bar>
      </div>
    </header>
    <div class="content" v-if="editor">
      <EditorContent key="editor" :editor="editor"></EditorContent>
    </div>
    <footer class="footer" v-if="!readOnly">
      <button class="btn btn-link" @click="$emit('cancel')">Cancel</button>
      <button class="btn btn-link-primary" @click="$emit('save', editor.getJSON())">Save</button>
    </footer>
  </div>
</template>

<script>
import NovadocMenuButton from '../../views/Novadoc/Menu/NovadocMenuButton'
import MenuGroup from '../../views/Novadoc/MenuGroup'
import NovadocLinkInput from '../../views/Novadoc/Menu/NovadocLinkInput'
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import Novaschema from '@/views/Novadoc/Novaschema'
import Paragraph from '@/views/Novadoc/Paragraph'
import TextColor from '@/views/Novadoc/TextColor'
import BgColor from '@/views/Novadoc/BgColor'
import {
  Blockquote,
  Bold,
  BulletList,
  Code,
  History,
  Italic,
  Link,
  ListItem,
  OrderedList, Placeholder,
  Strike,
  TrailingNode,
  Underline
} from 'tiptap-extensions'
import ListMerger from '@/views/Novadoc/ListMerger'
import TabEater from '@/views/Novadoc/TabEater'
import { ListIcon, TerminalIcon } from 'vue-feather-icons'

export default {
  name: 'ProseInput',
  components: {
    NovadocMenuButton,
    EditorContent,
    EditorMenuBar,
    MenuGroup,
    NovadocLinkInput,
    TerminalIcon,
    ListIcon
  },
  props: {
    readOnly: { type: Boolean, default: false },
    value: { default: () => {} }
  },
  data () {
    return {
      editor: null
    }
  },
  mounted () {
    this.buildEditor()
  },
  destroyed () {
    this.destroyEditor()
  },
  methods: {
    getCurrentActiveNode (depth = 1) {
      const sel = this.editor.state.selection
      if (sel) {
        const node = sel.$from.node(sel.$from.depth - depth)
        if (node) {
          return node.type.name
        }
      }
    },
    buildEditor () {
      this.destroyEditor()
      this.editor = new Editor({
        editable: !this.readOnly,
        extensions: [
          new Novaschema(),
          new Paragraph(),
          new TextColor(),
          new BgColor(),
          new Bold(),
          new Blockquote(),
          new Italic(),
          new Underline(),
          new Strike(),
          new Code(),
          new History(),
          new BulletList(),
          new ListItem(),
          new OrderedList(),
          new ListMerger(),
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
          new TabEater()
        ],
        emptyDocument: {
          type: 'doc',
          content: this.value
        },
        content: this.value,
        onUpdate: ({ getJSON }) => {
          this.$emit('input', getJSON())
        }
      })
    },
    destroyEditor () {
      if (this.editor) {
        this.editor.destroy()
      }
    }
  },
  watch: {
    readOnly (val) {
      if (this.editor) {
        this.editor.setOptions({
          editable: !val
        })
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.prose-input {
  background: #fff;
}
.menu-bar {
  display: flex;
  align-items: center;
  border: solid 1px #ccc;
  border-radius: 4px 4px 0 0 ;
  border-bottom: none;
  padding: 4px;

  .stroke-current {
    stroke: transparent;
  }
  .active .stroke-current {
    stroke: transparent;
  }

}

.content {
  border: solid 1px #ccc;
  border-radius: 0 0 4px 4px;
  padding: 8px;
}
.readOnly {
  .content {
    border: none;
    padding: 8px 0;
  }
}

.footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 16px;
  .btn {
    padding-left: 8px;
    padding-right: 8px;
  }
}
</style>
<style lang="postcss">
.prose-input .ProseMirror {
  outline: none;

  a {
    text-decoration: underline;
    color: #4574D3;
  }

  ol {
    list-style: decimal;
  }
  ul {
    list-style: circle;
  }
  ol, ul {
    margin-left: 24px;
    margin-bottom: 8px;
  }

  code {
    background: #dedede;
    padding: 4px;
    font-size: 12px;
  }

}

.prose-input .content *.is-empty:nth-child(1)::before,
.prose-input .content *.is-empty:nth-child(2)::before {
  content: attr(data-empty-text);
  float: left;
  color: #aaa;
  pointer-events: none;
  height: 0;
}
</style>
