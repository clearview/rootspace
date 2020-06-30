<template>
  <div class="editor content">
    <div class="codex-editor">
      <div class="ce-block" v-for="(val, index) in value" :key="index">
        <paragraph v-if="val.type === 'paragrap'" :value="val"></paragraph>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

import { DocumentResource } from '@/types/resource'

import Paragraph from '@/components/editor/readonlyMode/Paragraph.vue'

@Component({
  name: 'ReadOnly',
  components: {
    Paragraph
  }
})

export default class Document extends Vue {
  @Prop({ type: Object })
  private readonly value!: DocumentResource;
}
</script>
