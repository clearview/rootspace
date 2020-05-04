<template>
  <layout-main>
    <div id="editor-toolbar">
      <h1>Document Title</h1>
    </div>

    <editor id="editor" :content="value" :is-changed="isChanged" />
  </layout-main>
</template>

<script lang="ts">
import Vue from 'vue'

import LayoutMain from '@/components/LayoutMain.vue'
import Editor from '@/components/Editor.vue'

type ComponentData = {
  value: object;
  isChanged: boolean;
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
      isChanged: false
    }
  },
  mounted () {
    window.setInterval(() => {
      if (this.isChanged) {
        this.save()
        console.log('changed')
      } else {
        console.log('not changed')
      }
    }, 3 * 1000)
  },
  methods: {
    save () {
      window.editor.save().then((savedData: object) => {
        console.log(savedData)
        this.value = savedData
      })
    }
  }
})
</script>

<style lang="postcss" scoped>
h1 {
  @apply text-lg;
}

#editor-toolbar {
  @apply flex justify-between border-b-2 w-full p-0 px-2;

  border-color: theme("colors.secondary.default");
  position: absolute;
  top: 0.5rem;
  right: 0;
  left: 0;
  height: 40px;

  .btn {
    padding: 0;
    height: 30px;
    width: 125px;
  }
}

#editor {
  height: calc(100vh - 50px);
  overflow: auto;
  position: absolute;
  top: 3rem;
  right: 0;
  left: 0;
}
</style>
