<template>
  <div class="editor" />
</template>

<script lang="ts">
import Vue from 'vue'
import EditorJS from '@editorjs/editorjs'

import { createEditor } from '@/utils/editor'

type ComponentData = {
  editor: EditorJS | null;
  documentChanged: boolean;
}

export default Vue.extend({
  name: 'DocumentEditor',
  props: {
    content: {
      type: Object
    }
  },
  data (): ComponentData {
    return {
      editor: null,
      documentChanged: false
    }
  },
  computed: {
    data: {
      get (): EditorJS.OutputData {
        return this.content
      },
      set (data: EditorJS.OutputData) {
        this.$emit('update-editor', data)
      }
    }
  },
  async mounted () {
    this.editor = createEditor({
      holder: this.$el as HTMLElement,
      data: this.data,
      onChange: this.save.bind(this)
    })

    await this.editor.isReady
  },
  methods: {
    async save (api: EditorJS.API) {
      this.data = await api.saver.save()
    }
  }
})
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
