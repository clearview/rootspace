<template>
  <div>
    <div class id="codex-editor" />
  </div>
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

<style lang="postcss">
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,600;1,400;1,600&display=swap');

#codex-editor {
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
