<template>
  <h2 class="ce-header" v-html="value.data.text"></h2>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'ReadOnlyH2'
})

export default class ReadOnlyH2 extends Vue {
  @Prop({ type: Object })
  private readonly value!: object;
}
</script>
