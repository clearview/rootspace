<template>
  <div :class="['field', {
    'field-inline': inline,
    'field-border': border,
    'field-disabled': disabled
  }]">
    <label
      class="field-label"
      v-text="label"
      :for="name"
    />
    <slot />
  </div>
</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'Field'
})
export default class Field extends Vue {
  @Prop({ type: String })
  private readonly label?: string;

  @Prop({ type: String, default: '' })
  private readonly name!: string;

  @Prop({ type: Boolean })
  private readonly inline?: boolean;

  @Prop({ type: Boolean })
  private readonly border?: boolean;

  @Prop({ type: Boolean })
  private readonly disabled?: boolean;
}
</script>
