<template>
  <v-modal
    nosubmit
    :title="title"
    :visible="visible"
    @cancel="$emit('cancel')"
  >
    <div class="modal-body">
      <a
        v-for="item in list"
        :key="item.key"
        class="option"
        @click="$emit(`select:${item.key}`)"
      >
        <v-icon
          :name="item.icon"
          size="3.5em"
          class="option-icon"
        />

        <div class="option-content">
          <h5 v-text="item.name" />
          <p
            class="uppercase"
            v-text="item.desc"
          />
        </div>
      </a>
    </div>
  </v-modal>
</template>

<script lang="ts">
import Vue from 'vue'
import VModal from '@/components/Modal.vue'

export default Vue.extend({
  name: 'ModalSelectLinkType',
  inheritAttrs: false,
  components: {
    VModal
  },
  props: {
    title: {
      type: String
    },
    visible: {
      type: Boolean
    }
  },
  computed: {
    list () {
      return [
        {
          key: 'link',
          name: 'Link',
          desc: 'Add a link to anything you’d like.',
          icon: 'link'
        },
        {
          key: 'document',
          name: 'Document',
          desc: 'Write notes, thoughts or ideas.',
          icon: 'file'
        }
      ]
    }
  }
})
</script>

<style lang="postcss" scoped>
.modal-body {
  width: 456px;
}

.option {
  @apply flex flex-row p-3;
  @apply border rounded border-gray-400;
  @apply cursor-pointer;

  & + & {
    @apply mt-4;
  }

  &:hover {
    background-color: rgba(theme("colors.gray.100"), 0.5);
  }
}

.option-icon {
  @apply p-2 rounded-full;
  @apply bg-primary text-white;
}

.option-content {
  @apply pl-2 text-xs;
}
</style>
