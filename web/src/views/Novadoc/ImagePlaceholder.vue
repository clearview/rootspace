<template>
  <div class="image-placeholder">
    <img :src="src" alt="">
    <legacy-icon class="loading" name="loading" size="64" viewbox="100"></legacy-icon>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class ImagePlaceholder extends Vue {
  @Prop({ type: String, required: true })
  private readonly src!: string;
}
</script>

<style lang="postcss" scoped>
.image-placeholder {
  align-items: center;
  justify-content: center;
  position: relative;
  display: flex;
  margin: 48px auto;
  img {
    filter: blur(8px) saturate(25%);
  }
  .loading{
    position: absolute;
  }
}
</style>
