<template>
  <div class="cdx-block cdx-checklist">
    <div class="cdx-checklist__item" :class="isChecked(checkbox.checked)" v-for="(checkbox, index) in value.data.items" :key="index">
      <span class="cdx-checklist__item-checkbox"></span>
      <div class="cdx-checklist__item-text" v-html="checkbox.text"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'ReadOnlyChecklist'
})

export default class ReadOnlyChecklist extends Vue {
  @Prop({ type: Object })
  private readonly value!: object;

  isChecked (checked: boolean) {
    return checked ? 'cdx-checklist__item--checked' : ''
  }
}
</script>
