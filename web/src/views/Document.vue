<template>
  <layout-main>
    <div class="document-container">
      {{ title }}
      <div id="editor-toolbar">
        <h1 ref="title" contenteditable v-on="documentTitle" />
      </div>

      <editor id="editor" :content="value" @update-editor="onUpdateEditor" />
    </div>
  </layout-main>
</template>

<script lang="ts">
import Vue from 'vue'

import LayoutMain from '@/components/LayoutMain.vue'
import Editor from '@/components/Editor.vue'

type ComponentData = {
  value: object;
  isChanged: boolean;
  title: string;
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
      isChanged: false,
      title: 'Document Title'
    }
  },
  computed: {
    documentTitle () {
      return {
        input: this.onInput()
      }
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
    }, 5 * 1000)

    this.$refs.title.innerText = this.title
  },
  methods: {
    save () {
      window.editor.save().then((savedData: object) => {
        console.log(savedData)
        this.value = savedData
      })
    },
    onInput (e: object) {
      // this.$emit('input', e.target.innerText)
      // console.log(e.target.innerText)
      this.title = e.target.innerText
    },
    onUpdateEditor (...args: [object, boolean]) {
      const [value, isChanged] = args
      this.value = value
      this.isChanged = isChanged
      console.log('onUpdateEditor', this.value, this.isChanged)
    }
  }
})
</script>

<style lang="postcss" scoped>
.document-container {
  @apply max-w-2xl mx-auto p-0;

  width: 43.8rem;

  h1 {
    font-size: 2rem;

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
