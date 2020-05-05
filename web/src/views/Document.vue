<template>
  <layout-main>
    <div class="document-container">
      <div id="editor-toolbar">
        <h1 ref="title" contenteditable v-on="documentTitle" />
      </div>

      <editor id="editor" :content="value" :is-changed="isChanged" />
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
      return { ...this.$documentTitle, input: this.onInput }
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

    this.$refs.title.innerText = this.title
  },
  methods: {
    save () {
      window.editor.save().then((savedData: object) => {
        console.log(savedData)
        this.value = savedData
      })
    },
    onInput (e) {
      // this.$emit('input', e.target.innerText)
      // console.log(e.target.innerText)
      this.title = e.target.innerText
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
