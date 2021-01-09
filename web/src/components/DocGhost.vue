<template>
  <div :class="{'ghost': true, 'visible': active}">
    <div class="ghost-title"></div>
    <hr>
    <div class="ghost-heading"></div>
    <div class="ghost-paragraph" style="width: 50%"></div>
    <div class="ghost-paragraph" style="width: 60%"></div>
    <div class="ghost-paragraph" style="width: 40%"></div>
    <div class="ghost-paragraph" style="width: 45%"></div>

    <div class="ghost-heading"></div>
    <div class="ghost-paragraph" style="width: 50%"></div>
    <div class="ghost-paragraph" style="width: 60%"></div>
    <div class="ghost-paragraph" style="width: 40%"></div>
    <div class="ghost-paragraph" style="width: 45%"></div>

    <div class="ghost-heading"></div>
    <div class="ghost-paragraph" style="width: 50%"></div>
    <div class="ghost-paragraph" style="width: 60%"></div>
    <div class="ghost-paragraph" style="width: 40%"></div>
    <div class="ghost-paragraph" style="width: 45%"></div>
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
    width: 100%;
    height: 36px;
    margin-bottom: 32px;
    background: linear-gradient(275.41deg, #EFF2F8 0%, rgba(241, 244, 249, 0.5) 100%);
  }
  .ghost-paragraph{
    background: linear-gradient(275.41deg, #EFF2F8 0%, rgba(241, 244, 249, 0.5) 100%);
    width: 100%;
    margin: 16px 0;
    height: 12px;
  }
  .ghost-heading{
    background: linear-gradient(275.41deg, #EFF2F8 0%, rgba(241, 244, 249, 0.5) 100%);
    width: 80%;
    margin: 32px 0 24px;
    height: 28px;
    &:not(:nth-child(3)){
      margin-top: 80px;
    }
  }

  hr {
    border: 1px solid #EDEFF3;
    margin: 24px 0;
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
