<template>
  <div class="editor content">
    <div class="codex-editor">
      <div class="ce-block" v-for="(val, index) in value.blocks" :key="index">
        <div class="ce-block__content">
          <editor-checklist v-if="val.type === 'checklist'" :value="val"></editor-checklist>
          <editor-code v-if="val.type === 'code'" :value="val"></editor-code>
          <editor-delimiter v-if="val.type === 'delimiter'" :value="val"></editor-delimiter>
          <editor-h1 v-if="val.type === 'h1'" :value="val"></editor-h1>
          <editor-h2 v-if="val.type === 'h2'" :value="val"></editor-h2>
          <editor-h3 v-if="val.type === 'h3'" :value="val"></editor-h3>
          <editor-image v-if="val.type === 'image'" :value="val"></editor-image>
          <editor-link-tool v-if="val.type === 'linkTool'" :value="val"></editor-link-tool>
          <editor-list v-if="val.type === 'list'" :value="val"></editor-list>
          <editor-paragraph v-if="val.type === 'paragraph'" :value="val"></editor-paragraph>
          <editor-quote v-if="val.type === 'quote'" :value="val"></editor-quote>
          <editor-raw v-if="val.type === 'raw'" :value="val"></editor-raw>
          <editor-table v-if="val.type === 'table'" :value="val"></editor-table>
          <editor-warning v-if="val.type === 'warning'" :value="val"></editor-warning>
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
}
</script>
