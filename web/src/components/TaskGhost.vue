<template>
  <div :class="{'ghost': true, 'visible': active}">
    <div class="ghost-color" :style="{height: `${height}px`}"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'TaskGhost'
})
export default class TaskGhost extends Vue {
    @Prop({ type: Boolean, default: false })
    private readonly active!: boolean;

    @Prop({ type: Number, default: 600 })
    private readonly height!: number;
}
</script>

<style lang="postcss" scoped>
  .ghost {
    @apply p-8;
    animation: haunt 0.5s ease infinite alternate;
    display: none;
  }

  .ghost.visible {
    display: block;
  }

  .ghost-color {
    background: repeating-linear-gradient(
      90deg,
      theme('colors.gray.100'),
      theme('colors.gray.100') 280px,
      #fff 280px,
      #fff 320px
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
