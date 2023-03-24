<template>
  <div :class="{'ghost': true, 'visible': active}">
    <div class="ghost-color" :style="{height: `${height}px`}"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'ListGhost'
})
export default class ListGhost extends Vue {
    @Prop({ type: Boolean, default: false })
    private readonly active!: boolean;

    @Prop({ type: Number, default: 600 })
    private readonly height!: number;
}
</script>

<style lang="postcss" scoped>
  .ghost {
    /* @apply pr-8; */
    padding-right: 24px;
    padding-left: 24px;
    animation: haunt 0.5s ease infinite alternate;
    display: none;
  }

  .ghost.visible {
    display: block;
  }

  .ghost-color {
    background: repeating-linear-gradient(
      0deg,
      theme('colors.gray.100'),
      theme('colors.gray.100') 40px,
      #fff 40px,
      #fff 60px
    );
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
