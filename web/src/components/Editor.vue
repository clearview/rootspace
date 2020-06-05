<template>
  <div class="editor" />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Editor from '@editorjs/editorjs'

import { createEditor } from '@/utils/editor'

type ComponentData = {
  editor: Editor | null;
}

export default Vue.extend({
  name: 'DocumentEditor',
  props: {
    value: {
      type: Object as PropType<EditorJS.OutputData>
    }
  },
  data (): ComponentData {
    return {
      editor: null
    }
  },
  async mounted () {
    this.editor = createEditor({
      holder: this.$el as HTMLElement,
      data: this.value,
      logLevel: 'ERROR' as EditorJS.LogLevels,
      onChange: this.save.bind(this)
    })

    await this.editor.isReady
  },
  methods: {
    async save () {
      if (!this.editor) {
        return
      }

      const data = await this.editor.save()

      this.$emit('input', data)
    }
  }
})
</script>

<style lang="postcss" scope>
.editor {
  font-family: 'Open Sans', sans-serif;

  .ce-header {
    @apply p-0 mb-0;
  }

  .ce-block__content,
  .ce-toolbar__content {
    @apply max-w-none m-0;
  }

  .cdx-settings-button--active,
  .ce-toolbox__button--active,
  .ce-toolbox__button:hover,
  .ce-toolbar__plus--active,
  .ce-toolbar__plus:hover {
    @apply text-primary;
  }
}
</style>
