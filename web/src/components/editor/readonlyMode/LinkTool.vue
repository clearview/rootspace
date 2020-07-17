<template>
  <div class="cdx-block">
    <div class="link-tool">
      <div class="link-tool__input-holder link-tool__input-holder--error">
        <div class="cdx-input link-tool__input" v-html="value.data.link"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'ReadOnlyLinkTool'
})

export default class ReadOnlyLinkTool extends Vue {
  @Prop({ type: Object })
  private readonly value!: object;
}
</script>
