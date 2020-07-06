<template>
  <h3 class="ce-header" v-html="value.data.text"></h3>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'ReadOnlyH3'
})

export default class ReadOnlyH3 extends Vue {
  @Prop({ type: Object })
  private readonly value!: object;
}
</script>
