<template>
  <div>
    <div class id="codex-editor" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import config from '@/utils/config'

import { rootEditor } from '@/utils/editor'

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
      documentChanged: false
    }
  },
  mounted () {
    const params = {
      savedData: this.content,
      onChange: this.onChange
    }
    const editor = rootEditor(params)

    window.setInterval(() => {
      if (this.documentChanged) {
        editor.save().then((savedData: object) => {
          this.$emit('update-editor', savedData, this.documentChanged)
          // console.log('-- Save --')
        })
      }
    }, config.saveInterval * 1000)
  },
  methods: {
    onChange () {
      this.documentChanged = true
      // console.log('++ Onchange ++')
    }
  }
})
</script>

<style lang="postcss">
#codex-editor {
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
