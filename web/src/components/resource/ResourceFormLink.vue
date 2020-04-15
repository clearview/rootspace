<template>
  <form
    class="form"
    @submit.prevent="submit"
  >
    <v-field label="Section" class="mt-0">
      <input
        type="text"
        class="input"
        placeholder="Section"
        v-model="payload.sectionId"
      >
    </v-field>

    <hr class="my-4 border-gray-100" />

    <v-field
      label="Title"
      :disabled="!payload.sectionId"
    >
      <div class="flex flow-row items-center">
        <input
          type="text"
          class="input"
          placeholder="Enter title"
          v-model="payload.title"
        >
        <v-icon
          name="folder"
          size="2em"
          class="ml-2 text-gray-400"
        />
      </div>
    </v-field>

    <v-field
      label="Link"
      :disabled="!payload.sectionId"
    >
      <input
        type="text"
        class="input"
        placeholder="Add URL"
        v-model="payload.value"
      >
    </v-field>

    <v-field
      inline
      border
      label="Always open in new Tab"
      class="mb-0"
      :disabled="!payload.sectionId"
    >
      <button-switch v-model="payload.config.alwaysOpen" />
    </v-field>
  </form>
</template>

<script lang="ts">
import Vue from 'vue'

import ButtonSwitch from '@/components/ButtonSwitch.vue'
import VField from '@/components/Field.vue'
import VIcon from '@/components/icons/Index.vue'

type ComponentData = {
  payload: Resource.Link;
}

export default Vue.extend({
  name: 'ResourceFormLink',
  components: {
    ButtonSwitch,
    VField,
    VIcon
  },
  data (): ComponentData {
    return {
      payload: {
        spaceId: null,
        sectionId: null,
        title: '',
        type: 'link',
        value: '',
        config: {
          alwaysOpen: false
        }
      }
    }
  },
  methods: {
    submit (): void {
      this.$emit('submit', this.payload)
    }
  }
})
</script>

<style lang="postcss" scoped>
.form {
  width: 360px;
}
</style>
