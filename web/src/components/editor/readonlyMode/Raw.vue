<template>
  <textarea class="ce-code__textarea cdx-input" readonly v-model="value.data.html"></textarea>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'ReadOnlyRaw'
})

export default class ReadOnlyRaw extends Vue {
  @Prop({ type: Object })
  private readonly value!: object;
}
</script>
