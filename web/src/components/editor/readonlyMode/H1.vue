<template>
  <h1 class="ce-header" v-html="value.data.text"></h1>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'ReadOnlyH1'
})

export default class ReadOnlyH1 extends Vue {
  @Prop({ type: Object })
  private readonly value!: object;
}
</script>
