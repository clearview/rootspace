<template>
  <div class="editor">
    <div class="editor-header">
      <input
        type="text"
        v-model="payload.title"
        class="editor-title"
        placeholder="Your Title Here"
        ref="title"
        @input="save"
      >
      <v-icon
        v-show="loading"
        class="icon-loading"
        name="loading"
        size="2em"
        viewbox="100"
      />
    </div>

    <div class="editor-content" ref="content" />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Editor from '@editorjs/editorjs'

import { createEditor } from '@/utils/editor'
import { DocumentResource } from '@/types/resource'

type ComponentData = {
  editor: Editor | null;
  payload: DocumentResource;
}

type ComponentRefs = {
  content: HTMLElement;
  title: HTMLInputElement;
}

export default Vue.extend({
  name: 'DocumentEditor',
  props: {
    value: {
      type: Object as PropType<DocumentResource>
    },
    loading: {
      type: Boolean
    }
  },
  data (): ComponentData {
    return {
      editor: null,
      payload: { ...this.value }
    }
  },
  computed: {
    refs (): ComponentRefs {
      return {
        content: this.$refs.content as HTMLElement,
        title: this.$refs.title as HTMLInputElement
      }
    }
  },
  async mounted () {
    this.editor = createEditor({
      holder: this.refs.content,
      data: this.value.content,
      logLevel: 'ERROR' as EditorJS.LogLevels,
      onChange: this.save.bind(this)
    })

    await this.editor.isReady

    this.refs.title.focus()
  },
  beforeDestroy () {
    if (!this.editor) {
      return
    }

    this.editor.destroy()
  },
  methods: {
    async save () {
      if (!this.editor) {
        return
      }

      this.payload.content = await this.editor.save()

      this.$emit('input', this.payload)
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

<style lang="postcss" scoped>
.editor {
  @apply w-full mx-auto p-0;

  max-width: 700px;
}

.editor-header {
  @apply flex justify-between items-center;
  @apply border-b;
  @apply pt-2 px-0 pb-6;
  @apply my-0;

  border-color: #DEE2EE;
}

.editor-title {
  font-size: 2rem;
  width: 100%;

  &:focus {
    outline: none;
  }
}

.editor-content {
  @apply pt-6;
}
</style>
