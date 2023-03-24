<template>
  <form
    class="flex flex-col flex-1"
    @submit.prevent="submit"
  >
    <v-field label="Folder Name">
      <input
        ref="initialInput"
        type="text"
        class="input"
        placeholder="Enter folder name"
        v-model="payload.title"
      >
    </v-field>

    <button
      type="submit"
      :class="{
        hidden: nobutton
      }"
    />
  </form>
</template>

<script lang="ts">
import Vue from 'vue'

import { required } from 'vuelidate/lib/validators'

import { NodeResource } from '@/types/resource'

import ButtonSwitch from '@/components/ButtonSwitch.vue'
import VField from '@/components/Field.vue'
import { Component, Prop, Ref } from 'vue-property-decorator'

@Component({
  name: 'FormFolder',
  components: {
    ButtonSwitch,
    VField
  },
  validations: {
    payload: {
      title: { required }
    }
  }
})
export default class FormFolder extends Vue {
  @Prop({ type: Object, default: () => ({}) })
  private readonly value!: any;

  @Prop({ type: Number, default: 0 })
  private readonly space!: number;

  @Prop({ type: Boolean })
  private readonly nobutton!: boolean;

  @Ref('initialInput')
  private readonly initialInputRef!: HTMLInputElement;

  mounted () {
    this.initialInputRef.focus()
  }

  private payload: Partial<NodeResource> = {
    id: this.value.id || undefined,
    spaceId: this.value.space || this.space,
    title: this.value.title || '',
    type: 'folder'
  }

  submit (): void {
    this.$v.payload.$touch()

    if (!this.$v.payload.$invalid) {
      this.$emit('submit', this.payload)
    }
  }
}
</script>
