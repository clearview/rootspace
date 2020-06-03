<template>
  <form
    class="flex flex-col flex-1"
    @submit.prevent="submit"
  >
    <v-field
      v-if="!notitle"
      label="Title"
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
    >
      <button-switch v-model="payload.config.alwaysOpen" />
    </v-field>

    <button type="submit" class="hidden"/>
  </form>
</template>

<script lang="ts">
import Vue from 'vue'

import { required } from 'vuelidate/lib/validators'

import { LinkResource } from '@/types/resource'

import ButtonSwitch from '@/components/ButtonSwitch.vue'
import VField from '@/components/Field.vue'

type ComponentData = {
  payload: Omit<LinkResource, 'children'>;
}

export default Vue.extend({
  name: 'FormLink',
  components: {
    ButtonSwitch,
    VField
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    space: {
      type: Number,
      default: 0
    },
    notitle: {
      type: Boolean
    }
  },
  validations: {
    payload: {
      title: { required },
      value: { required }
    }
  },
  data (): ComponentData {
    return {
      payload: {
        id: this.value.id || undefined,
        spaceId: this.value.space || this.space,
        title: this.value.title || '',
        type: this.value.type || 'link',
        value: this.value.value || '',
        config: {
          alwaysOpen: false,

          ...this.value.config
        }
      }
    }
  },
  methods: {
    submit (): void {
      this.$v.payload.$touch()

      if (!this.$v.payload.$invalid) {
        this.$emit('submit', this.payload)
      }
    }
  }
})
</script>
