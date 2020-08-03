<template>
  <form
    class="flex flex-col flex-1"
    @submit.prevent="submit"
  >
    <v-field
      v-if="!notitle"
      label="Title"
    >
      <input
        ref="initialInput"
        type="text"
        class="input"
        placeholder="Enter title"
        v-model="payload.title"
      >
      <v-icon
        name="folder"
        size="2em"
        class="flex-none ml-2 text-gray-400"
      />
    </v-field>

    <v-field label="Link">
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
      align="right"
      class="mb-0"
    >
      <button-switch v-model="payload.newTab" />
    </v-field>

    <button
      type="submit"
      class="hidden"
    />
  </form>
</template>

<script lang="ts">
import Vue from 'vue'

import { required } from 'vuelidate/lib/validators'

import { LinkResource } from '@/types/resource'

import ButtonSwitch from '@/components/ButtonSwitch.vue'
import VField from '@/components/Field.vue'
import { Component, Prop, Ref } from 'vue-property-decorator'

@Component({
  name: 'FormLink',
  components: {
    ButtonSwitch,
    VField
  },
  validations: {
    payload: {
      title: { required },
      value: { required }
    }
  }
})
export default class FormLink extends Vue {
  @Prop({ type: Object, default: () => ({}) })
  private readonly value!: any;

  @Prop({ type: Number, default: 0 })
  private readonly space!: number;

  @Prop({ type: Boolean })
  private readonly notitle!: boolean;

  @Ref('initialInput')
  private readonly initialInputRef!: HTMLInputElement;

  mounted () {
    this.initialInputRef.focus()
  }

  private payload: LinkResource = {
    id: this.value.id || undefined,
    spaceId: this.value.space || this.space,
    title: this.value.title || '',
    type: this.value.type || 'link',
    value: this.value.value || '',
    newTab: this.value.newTab || false
  }

  submit (): void {
    this.$v.payload.$touch()

    if (!this.$v.payload.$invalid) {
      this.$emit('submit', this.payload)
    }
  }
}
</script>
