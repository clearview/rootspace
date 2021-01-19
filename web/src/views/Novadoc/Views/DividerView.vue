<template>
  <div>
    <div class="divider-view" :class="{selected}">
      <NovadocMenu v-show="selected && view.editable" class="menu">
        <NovadocMenuButton @click="remove">
          <v-icon name="trash-archive" viewbox="16" size="16"></v-icon>
          Delete
        </NovadocMenuButton>
      </NovadocMenu>
      <hr class="novadoc-divider" @click="focus">
    </div>
  </div>
</template>

<script>

import { NodeSelection } from 'tiptap'
import NovadocMenuButton from '@/views/Novadoc/Menu/NovadocMenuButton'
import NovadocMenu from '@/views/Novadoc/Menu/NovadocMenu'

export default {
  components: {
    NovadocMenuButton,
    NovadocMenu
  },
  props: ['node', 'updateAttrs', 'view', 'selected', 'getPos'],
  methods: {
    focus () {
      const pos = this.getPos()
      const state = this.view.state
      const tr = state.tr
      this.view.dispatch(tr.setSelection(NodeSelection.create(tr.doc, pos)))
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
.divider-view {
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  margin: 24px 0;
  .menu {
    position: absolute;
    top: -16px;
    right: -86px;
  }
  hr {
    align-self: stretch;
    border: 1px dashed #AAB1C5;
  }

  &.selected {
    hr {
      border: dashed 1px #146493;
    }
  }
}

.alt {
}
</style>
