<template>
  <div>
    <input
      type="file"
      ref="attachmentFileRef"
      class="hidden"
      @change="handleSubmitFile"
      multiple
    />
    <button
      class="btn btn-upload"
      @click="pickFile"
      :disabled="isDisabled"
    >
      <mono-icon class="icon is-left" name="plus" />
      {{ text }}
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from '@vue/composition-api'

export default defineComponent({
  props: {
    isDisabled: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: 'Upload File'
    },
    handleUploadFile: Function
  },
  setup (props) {
    const attachmentFileRef: Ref<HTMLInputElement | undefined> = ref(undefined)

    const pickFile = () => {
      if (attachmentFileRef.value) {
        attachmentFileRef.value.click()
      }
    }

    const handleSubmitFile = (event: Event) => {
      if (props.handleUploadFile) {
        props.handleUploadFile(event)
      }
    }

    return {
      attachmentFileRef,
      pickFile,
      handleSubmitFile
    }
  }
})
</script>

<style lang="postcss" scoped>
.btn-upload {
  border-color: #8cd5ff;
  background: #8cd5ff;
  color: #2c2b35;
  padding: 0.3rem 1rem;
  height: 32px;
}
</style>
