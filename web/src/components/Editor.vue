<template>
  <div>
    <div class id="codex-editor" />

    <div class="editor-body">
      <pre>{{content}}</pre>
    </div>
  </div>
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

declare global {
    interface Window { editor: any } // eslint-disable-line
}

window.editor = window.editor || {}

export default Vue.extend({
  name: 'DocumentEditor',
  props: {
    content: {
      type: Object
    }
  },
  mounted () {
    this.myEditor()
  },
  methods: {
    myEditor () {
      window.editor = new EditorJS({
        holder: 'codex-editor',
        autofocus: true,
        data: this.content,
        tools: {
          header: {
            class: Header,
            inlineToolbar: ['link'],
            config: {
              placeholder: 'Header'
            },
            shortcut: 'CMD+SHIFT+H'
          },
          list: {
            class: List,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+L'
          },
          image: Image,
          inlineCode: {
            class: InlineCode,
            shortcut: 'CMD+SHIFT+C'
          },
          embed: {
            class: Embed,
            config: {
              services: {
                youtube: true,
                codepen: true,
                instagram: true,
                twitter: true
              }
            }
          },
          quote: {
            class: Quote,
            inlineToolbar: true,
            config: {
              quotePlaceholder: 'Enter a quote',
              captionPlaceholder: 'Quote\'s author'
            },
            shortcut: 'CMD+SHIFT+O'
          },
          marker: {
            class: Marker,
            shortcut: 'CMD+SHIFT+M'
          },
          code: {
            class: Code,
            shortcut: 'CMD+SHIFT+C'
          },
          linkTool: LinkTool,
          delimiter: Delimiter,
          raw: Raw,
          table: {
            class: Table,
            inlineToolbar: true,
            shortcut: 'CMD+ALT+T'
          },
          warning: {
            class: Warning,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+W',
            config: {
              titlePlaceholder: 'Title',
              messagePlaceholder: 'Message'
            }
          },
          paragraph: {
            class: Paragraph,
            inlineToolbar: true
          },
          checklist: {
            class: Checklist,
            inlineToolbar: true
          }
        }
      })
    }
  }
})
</script>
