<template>
  <div :class="{'ghost': true, 'visible': active}">
    <div class="ghost-block" style="margin-left: auto; width: 104px"></div>
    <div class="ghost-block" style="width: 160px"></div>
    <div class="ghost-block" style="width: 96px"></div>
    <div class="ghost-block" style="width: 32px"></div>
    <div class="ghost-block" style="width: 256px"></div>
    <div class="ghost-block" style="width: 64px"></div>
    <div class="ghost-block" style="width: 32px"></div>
    <div class="ghost-block" style="margin-left: auto; width: 32px"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'ToolbarGhost'
})
export default class ToolbarGhost extends Vue {
    @Prop({ type: Boolean, default: false })
    private readonly active!: boolean;

    @Prop({ type: Number, default: 300 })
    private readonly height!: number;
}
</script>

<style lang="postcss" scoped>
  .ghost {
    animation: haunt 0.5s ease infinite alternate;
    display: none;
    width: 100%;
  }

  .ghost.visible {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ghost-block {
    height: 32px;
    width: 120px;
    background: linear-gradient(275.41deg, #EFF2F8 0%, rgba(241, 244, 249, 0.5) 100%);
    margin: 0 16px;
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
