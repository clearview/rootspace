<template>
  <div class="ce-paragraph cdx-block" v-html="value.data.text"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'ReadOnlyParagraph'
})

export default class ReadOnlyParagraph extends Vue {
  @Prop({ type: Object })
  private readonly value!: object;
}
</script>
