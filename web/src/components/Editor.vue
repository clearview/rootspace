<template>
  <div>
    {{ content }}
    <hr/>
    {{ readonly }}
    <div class="editor" />
  </div>
</template>

<script lang="ts">
import EditorJS from '@editorjs/editorjs'

import { createEditor } from '@/utils/editor'
import { Component, Prop, PropSync, Watch, Vue } from 'vue-property-decorator'

@Component({
  name: 'DocumentEditor'
})

export default class Editor extends Vue {
  // @Prop({ type: Object })
  // private readonly content!: EditorJS.OutputData;

  @PropSync('content', { type: Object }) syncedContent!: EditorJS.OutputData

  @Prop({ type: Boolean })
  private readonly readonly!: boolean;

  private editor: EditorJS | null = null;
  private documentChanged = false

  // get data (): EditorJS.OutputData {
  //   return this.content
  // }

  // set data (data: EditorJS.OutputData) {
  //   this.$emit('update-editor', data)
  // }

  @Watch('syncedContent')
  watchSyncContent (data: EditorJS.OutputData) {
    console.log('update Content')
    this.$emit('update-editor', data)
  }

  async mounted () {
    console.log('mounted', this.syncedContent)
    this.editor = createEditor({
      holder: this.$el as HTMLElement,
      data: this.syncedContent,
      onChange: this.save.bind(this)
    })

    console.log('this.editor', this.editor)

    await this.editor.isReady
  }

  async save (api: EditorJS.API) {
    if (this.readonly) return

    this.syncedContent = await api.saver.save()
    console.log(this.syncedContent)
  }
}
</script>

<style lang="postcss">
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,600;1,400;1,600&display=swap');

.editor {
  font-family: 'Open Sans', sans-serif;

  .ce-header {
    padding: 0;
    margin-bottom: 0;
  }

  .cdx-settings-button--active,
  .ce-toolbox__button--active,
  .ce-toolbox__button:hover,
  .ce-toolbar__plus--active,
  .ce-toolbar__plus:hover {
    color: theme("colors.primary.default");
  }

  .tc-toolbar {
    background-color: theme("colors.primary.default");
  }

  .tc-toolbar__plus svg circle {
    fill: theme("colors.primary.default");
  }
}
</style>
