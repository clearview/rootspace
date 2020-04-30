<template>
  <layout-main>
    <div id="editor-toolbar">
      <h1>Document Title</h1>
      <button class="btn btn-primary" @click="save">Save</button>
    </div>
    <div id="editor">
      <div class id="codex-editor" />

      <div class="editor-body">
        <pre>{{value}}</pre>
      </div>
    </div>
  </layout-main>
</template>

<script lang="ts">
import Vue from 'vue'
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import Image from '@editorjs/image'
import InlineCode from '@editorjs/inline-code'
import Embed from '@editorjs/embed'
import Quote from '@editorjs/quote'
import Marker from '@editorjs/marker'
import Code from '@editorjs/code'
import LinkTool from '@editorjs/link'
import Delimiter from '@editorjs/delimiter'
import Raw from '@editorjs/raw'
import Table from '@editorjs/table'
import Warning from '@editorjs/warning'
import Paragraph from '@editorjs/paragraph'
import Checklist from '@editorjs/checklist'

import LayoutMain from '@/components/LayoutMain.vue'

declare global {
    interface Window { editor: any } // eslint-disable-line
}

window.editor = window.editor || {}

type ComponentData = {
  value: object;
}

export default Vue.extend({
  name: 'Document',
  components: {
    LayoutMain
  },
  data (): ComponentData {
    return {
      value: {
        time: 1554508385558,
        blocks: [
          { type: 'header', data: { text: 'Root Editor Demo', level: 2 } },
          {
            type: 'list',
            data: {
              style: 'ordered',
              items: ['Learn Vue.js<br>', 'Learn Editor.js']
            }
          }
        ]
      }
    }
  },
  mounted () {
    this.myEditor()
  },
  methods: {
    save () {
      window.editor.save().then((savedData: object) => {
        console.log(savedData)
        this.value = savedData
      })
    },
    myEditor () {
      window.editor = new EditorJS({
        holder: 'codex-editor',
        autofocus: true,
        data: this.value,
        tools: {
          header: Header,
          list: List,
          image: Image,
          inlineCode: InlineCode,
          embed: Embed,
          quote: Quote,
          marker: Marker,
          code: Code,
          linkTool: LinkTool,
          delimiter: Delimiter,
          raw: Raw,
          table: Table,
          warning: Warning,
          paragraph: Paragraph,
          checklist: Checklist
        }
      })
    }
  }
})
</script>

<style lang="postcss" scoped>
h1 {
  @apply text-xl;
}

#editor-toolbar {
  @apply flex justify-between border-b-2 p-2 w-full p-0 pb-4;

  border-color: theme("colors.secondary.default");
  height: 60px;

  h1 {
    @apply self-center;
  }
}
#editor {
  height: calc(100vh - 60px);
  overflow: auto;
}
</style>
