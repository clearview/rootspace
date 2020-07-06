<template>
  <blockquote class="cdx-block cdx-quote">
    <div class="cdx-input cdx-quote__text" v-html="value.data.text"></div>
    <div class="cdx-input cdx-quote__caption" v-html="value.data.caption"></div>
  </blockquote>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'ReadOnlyQuote'
})

export default class ReadOnlyQuote extends Vue {
  @Prop({ type: Object })
  private readonly value!: object;
}
</script>
