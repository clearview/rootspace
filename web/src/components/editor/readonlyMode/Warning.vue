<template>
  <div class="cdx-block cdx-warning">
    <div class="cdx-input cdx-warning__title" v-html="value.data.title"></div>
    <div class="cdx-input cdx-warning__message" v-html="value.data.message"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'ReadOnlyWarning'
})

export default class ReadOnlyWarning extends Vue {
  @Prop({ type: Object })
  private readonly value!: object;
}
</script>
