<template>
  <layout-main>
    <div class="document-container">
      <div id="editor-toolbar">
        <input type="text" v-model="title" class="title">
      </div>

      <editor id="editor" :content="value" @update-editor="onUpdateEditor" />
    </div>
  </layout-main>
</template>

<script lang="ts">
import Vue from 'vue'
import config from '@/utils/config'

import LayoutMain from '@/components/LayoutMain.vue'
import Editor from '@/components/Editor.vue'

type ComponentData = {
  value: object;
  title: string;
  timer: undefined | number;
}

export default Vue.extend({
  name: 'Document',
  components: {
    LayoutMain,
    Editor
  },
  data (): ComponentData {
    return {
      value: {
        time: 1554508385558,
        blocks: [
          { type: 'header', data: { text: 'Root Editor Demo', level: 2 } },
          {
            type: 'list',
            data: {
              style: 'ordered',
              items: ['Learn Vue.js<br>', 'Learn Editor.js']
            }
          }
        ]
      },
      title: 'Document Title',
      timer: undefined
    }
  },
  watch: {
    title () {
      clearTimeout(this.timer)
      this.timer = setTimeout(this.saveDocument, config.saveInterval * 1000)
    }
  },
  methods: {
    onUpdateEditor (value: object) {
      this.value = value
      this.saveDocument()
    },
    saveDocument () {
      console.log('saveDocument -- ', this.title, this.value)
    }
  }
})
</script>

<style lang="postcss" scoped>
.document-container {
  @apply mx-auto p-0;

  width: 40.5rem;

  .title {
    font-size: 2rem;
    width: 100%;

    &:focus {
      outline: none;
    }
  }

  #editor-toolbar {
    @apply flex justify-between border-b-2 w-full p-0;

    border-color: theme("colors.secondary.default");
    padding-bottom: 1.5rem;
  }

  #editor {
    padding-top: .5rem;
  }
}
</style>
