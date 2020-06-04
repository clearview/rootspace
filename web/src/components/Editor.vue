<template>
  <div id="codex-editor" class="editor" />
</template>

<script lang="ts">
import Vue from 'vue'

import { createEditor } from '@/utils/editor'

import { Editor } from '@/types/resource'

export default Vue.extend({
  name: 'DocumentEditor',
  props: {
    content: {
      type: Object
    }
  },
  data (): Editor {
    return {
      documentChanged: false,
      editor: true
    }
  },
  async mounted () {
    const params = {
      savedData: this.content,
      onChange: this.onChange
    }

    this.editor = createEditor(params)

    await this.editor.isReady
  },
  methods: {
    onChange () {
      this.editor.save().then((savedData: object) => {
        this.$emit('update-editor', savedData)
      })
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
