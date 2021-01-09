<template>
  <div>
    <div :class="`image-view align-${node.attrs.align} size-${node.attrs.size} ${selected ? 'selected' : ''}`">
      <NovadocMenu v-show="selected">
        <NovadocMenuButton :active="node.attrs.size === 'small'" @click="resize('small')">
          Small
        </NovadocMenuButton>
        <NovadocMenuButton :active="node.attrs.size === 'medium'" @click="resize('medium')">
          Medium
        </NovadocMenuButton>
        <NovadocMenuButton :active="node.attrs.size === 'large'" @click="resize('large')"
        no-margin>
          Large
        </NovadocMenuButton>
        <NovadocMenuSeparator></NovadocMenuSeparator>
        <NovadocMenuButton :active="node.attrs.align === 'left'" @click="align('left')">
          <v-icon name="image-left" viewbox="16" size="16"></v-icon>
          <span>Left</span>
        </NovadocMenuButton>
        <NovadocMenuButton :active="node.attrs.align === 'center'" @click="align('center')">
          <v-icon name="image-center" viewbox="16" size="16"></v-icon>
          <span>Center</span>
        </NovadocMenuButton>
        <NovadocMenuButton :active="node.attrs.align === 'right'" @click="align('right')"
                           no-margin>
          <v-icon name="image-right" viewbox="16" size="16"></v-icon>
          <span>Right</span>
        </NovadocMenuButton>
        <NovadocMenuSeparator></NovadocMenuSeparator>
        <NovadocMenuButton @click="remove">
          <v-icon name="trash-archive" viewbox="16" size="16"></v-icon> Delete
        </NovadocMenuButton>
      </NovadocMenu>
      <img :src="node.attrs.src" :alt="node.attrs.alt" :class="`novadoc-image`" @click.self="focus">
    </div>
  </div>
</template>

<script>

import { NodeSelection } from 'tiptap'
import NovadocMenu from '../Menu/NovadocMenu'
import NovadocMenuButton from '@/views/Novadoc/Menu/NovadocMenuButton'
import NovadocMenuSeparator from '@/views/Novadoc/Menu/NovadocMenuSeparator'

export default {
  components: {
    NovadocMenuSeparator,
    NovadocMenuButton,
    NovadocMenu
  },
  props: ['node', 'updateAttrs', 'view', 'selected', 'getPos'],
  methods: {
    focus () {
      const pos = this.getPos()
      const state = this.view.state
      const tr = state.tr
      this.view.dispatch(tr.setSelection(NodeSelection.create(tr.doc, pos)).scrollIntoView())
    },
    align (alignment) {
      this.updateAttrs({
        align: alignment
      })
      this.$nextTick(() => {
        this.view.focus()
      })
    },
    resize (size) {
      this.updateAttrs({
        size: size
      })
      this.$nextTick(() => {
        this.view.focus()
      })
    },
    remove () {
      const state = this.view.state
      const tr = state.tr
      this.view.dispatch(tr.deleteSelection())
    }
  }
}
</script>

<style lang="postcss" scoped>
.image-view {
  display: flex;
  flex-direction: column;
  position: relative;

  .novadoc-image {
    width: auto;
    margin: 48px auto 48px auto;
    border-radius: 4px;
    transition: all 0.15s ease;
    border: solid 4px transparent;
    padding: 4px;
    height: auto;
    object-fit: cover;
  }

  &.align-center {
    align-items: center;
    text-align: center;
  }

  &.align-left {
    align-items: flex-start;
    text-align: left;

    .novadoc-image {
      margin-left: 0;
      margin-right: auto;
    }
  }

  &.align-right {
    align-items: flex-end;
    text-align: right;

    .novadoc-image {
      margin-left: auto;
      margin-right: 0;
    }
  }

  &.size-small {
    .novadoc-image {
      width: 25%;
    }
  }
  &.size-medium {
    .novadoc-image {
      width: 50%;
    }
  }
  &.size-large {
    .novadoc-image {
      width: 100%;
    }
  }

  &.selected {
    .novadoc-image {
      border: solid 4px #146493;
    }
  }
}

.alt {
}
</style>
