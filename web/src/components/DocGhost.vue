<template>
  <div :class="{'ghost': true, 'visible': active}">
    <div class="ghost-title"></div>
    <div class="ghost-paragraph"></div>
    <div class="ghost-paragraph"></div>
    <div class="ghost-paragraph"></div>
    <div class="ghost-paragraph"></div>
    <div class="ghost-paragraph-short"></div>
    <div class="ghost-paragraph"></div>
    <div class="ghost-paragraph"></div>
    <div class="ghost-paragraph-short"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'DocGhost'
})
export default class DocGhost extends Vue {
    @Prop({ type: Boolean, default: false })
    private readonly active!: boolean;

    @Prop({ type: Number, default: 300 })
    private readonly height!: number;
}
</script>

<style lang="postcss" scoped>
  .ghost {
    @apply p-8;
    animation: haunt 0.5s ease infinite alternate;
    display: none;
    width: 720px;
    margin: 48px auto;
  }

  .ghost.visible {
    display: block;
  }

  .ghost-title {
    width: 50%;
    height: 48px;
    margin-bottom: 32px;
    background: #eee;
  }
  .ghost-paragraph{
    background: #eee;
    width: 100%;
    margin: 24px 0;
    height: 24px;
  }
  .ghost-paragraph-short {
    background: #eee;
    width: 30%;
    margin: 24px 0 48px 0;
    height: 24px;
  }

  @keyframes haunt {
    from {
      opacity: 0.5;
    }
    to {
      opacity: 1;
    }
  }
</style>
