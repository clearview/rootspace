<template>
  <div class="textarea">
    <textarea
      class="input"
      :style="computedStyles"
      :placeholder="placeholder"
      v-model="val"
      ref="commentTextarea"
      @keydown="commentHandler"
      @keyup.esc="exitEditMode"
      @focus="resize"
    ></textarea>
    <textarea class="shadow" v-model="val" ref="shadowTextarea" tabindex="0"></textarea>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Ref, Vue } from 'vue-property-decorator'

@Component({
  name: 'TextareaAutoresize'
})
export default class TextareaAutoresize extends Vue {
  @Prop({ type: String, default: '' })
  private readonly value!: string

  @Prop({ type: String, default: '' })
  private readonly placeholder!: string

  @Prop({ type: Number, default: null })
  private readonly minHeight!: number

  @Prop({ type: Number, default: null })
  private readonly maxHeight!: number

  private val = ''
  private maxHeightScroll = false
  private height = 'auto'

  @Ref('shadowTextarea')
  private readonly shadowRef!: HTMLInputElement

  @Ref('commentTextarea')
  private readonly commentRef!: HTMLInputElement

  get computedStyles () {
    return {
      resize: 'none',
      height: this.height,
      overflow: 'hidden'
    }
  }

  @Watch('value')
  watchValue (val: string) {
    this.val = val
  }

  @Watch('val')
  watchVal (val: string) {
    this.$nextTick(this.resize)
    this.$emit('input', val)
  }

  @Watch('minHeight')
  watchMinHeight () {
    this.$nextTick(this.resize)
  }

  @Watch('maxHeight')
  watchMaxHeight () {
    this.$nextTick(this.resize)
  }

  resize () {
    this.$nextTick(() => {
      let contentHeight = this.shadowRef.scrollHeight + 24
      if (this.minHeight) {
        contentHeight = contentHeight < this.minHeight ? this.minHeight : contentHeight
      }
      if (this.maxHeight) {
        if (contentHeight > this.maxHeight) {
          contentHeight = this.maxHeight
          this.maxHeightScroll = true
        } else {
          this.maxHeightScroll = false
        }
      }
      const heightVal = contentHeight + 'px'
      this.height = heightVal
    })
    return this
  }

  commentHandler (e: any) {
    this.$emit('submit-comment', e)
  }

  exitEditMode () {
    this.$emit('cancel-comment')
  }

  focus () {
    this.commentRef.focus()
  }

  created () {
    this.val = this.value
  }

  mounted () {
    this.resize()
  }
}
</script>

<style lang="postcss" scoped>
textarea {
  width: 100%;
  transition: none;
  line-height: 17px;

  &.shadow {
    max-height: 0;
    pointer-events: none;
    opacity: 0;
    margin: 0;
  }
}
</style>
