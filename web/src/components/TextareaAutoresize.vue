<template>
  <div class="textarea">
    <textarea
      class="input"
      :style="computedStyles"
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
    console.log('value')
    this.val = val
  }

  @Watch('val')
  watchVal (val: string) {
    console.log('val')
    this.$nextTick(this.resize)
    this.$emit('input', val)
  }

  @Watch('minHeight')
  watchMinHeight () {
    console.log('minHeight')
    this.$nextTick(this.resize)
  }

  @Watch('maxHeight')
  watchMaxHeight () {
    console.log('maxHeight')
    this.$nextTick(this.resize)
  }

  resize () {
    this.$nextTick(() => {
      console.log('this.$el.scrollHeight', this.$el.scrollHeight)
      // let contentHeight = this.$el.scrollHeight + 1
      let contentHeight = this.shadowRef.scrollHeight + 24
      // let contentHeight = 43
      if (this.minHeight) {
        // contentHeight = (contentHeight < this.minHeight) && (contentHeight < 43) ? this.minHeight : contentHeight
        contentHeight = contentHeight < this.minHeight ? this.minHeight : contentHeight
        // contentHeight = this.minHeight
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
      console.log('heightVal', heightVal)
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
  height: auto;
  resize: none;
  overflow: hidden;
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
