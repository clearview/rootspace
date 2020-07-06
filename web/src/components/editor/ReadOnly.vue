<template>
  <div class="editor content">
    <div class="codex-editor">
      <div class="ce-block" v-for="(val, index) in value.blocks" :key="index">
        <div class="ce-block__content">
          <component :is="editorReadonlyComponent(val.type)" :value="val"></component>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

import { DocumentResource } from '@/types/resource'

import EditorChecklist from '@/components/editor/readonlyMode/Checklist.vue'
import EditorCode from '@/components/editor/readonlyMode/Code.vue'
import EditorDelimiter from '@/components/editor/readonlyMode/Delimiter.vue'
import EditorH1 from '@/components/editor/readonlyMode/H1.vue'
import EditorH2 from '@/components/editor/readonlyMode/H2.vue'
import EditorH3 from '@/components/editor/readonlyMode/H3.vue'
import EditorImage from '@/components/editor/readonlyMode/Image.vue'
import EditorLinkTool from '@/components/editor/readonlyMode/LinkTool.vue'
import EditorList from '@/components/editor/readonlyMode/List.vue'
import EditorParagraph from '@/components/editor/readonlyMode/Paragraph.vue'
import EditorQuote from '@/components/editor/readonlyMode/Quote.vue'
import EditorRaw from '@/components/editor/readonlyMode/Raw.vue'
import EditorTable from '@/components/editor/readonlyMode/Table.vue'
import EditorWarning from '@/components/editor/readonlyMode/Warning.vue'

@Component({
  name: 'ReadOnly',
  components: {
    EditorChecklist,
    EditorCode,
    EditorDelimiter,
    EditorH1,
    EditorH2,
    EditorH3,
    EditorImage,
    EditorLinkTool,
    EditorList,
    EditorParagraph,
    EditorQuote,
    EditorRaw,
    EditorTable,
    EditorWarning
  }
})

export default class ReadOnly extends Vue {
  @Prop({ type: Object })
  private readonly value!: DocumentResource;

  editorReadonlyComponent (type: string) {
    switch (type) {
      case 'checklist':
        return 'editor-checklist'

      case 'code':
        return 'editor-code'

      case 'delimiter':
        return 'editor-delimiter'

      case 'h1':
        return 'editor-h1'

      case 'h2':
        return 'editor-h2'

      case 'h3':
        return 'editor-h3'

      case 'image':
        return 'editor-image'

      case 'linkTool':
        return 'editor-link-tool'

      case 'list':
        return 'editor-list'

      case 'paragraph':
        return 'editor-paragraph'

      case 'quote':
        return 'editor-quote'

      case 'raw':
        return 'editor-raw'

      case 'table':
        return 'editor-table'

      case 'warning':
        return 'editor-warning'
    }
  }
}
</script>
