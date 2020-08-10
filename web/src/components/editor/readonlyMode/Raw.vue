<template>
  <div class="cdx-block ce-rawtool">
    <textarea class="ce-rawtool__textarea cdx-input" readonly v-model="value.data.html"></textarea>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'ReadOnlyCode'
})

export default class ReadOnlyCode extends Vue {
  @Prop({ type: Object })
  private readonly value!: object;
}
</script>
