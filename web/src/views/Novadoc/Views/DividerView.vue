<template>
  <div>
    <div class="divider-view" :class="{selected}">
      <NovadocMenu v-show="selected && view.editable" class="menu">
        <NovadocMenuButton @click="remove">
          <legacy-icon name="trash-archive" viewbox="16" size="16"></legacy-icon>
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
    border: 0px;
    height: 1px;
    background: -webkit-linear-gradient(left, #FFFFFF, #AAB1C5, #FFFFFF); /* For Safari 5.1 to 6.0 */
    background: -o-linear-gradient(right, #FFFFFF, #AAB1C5, #FFFFFF); /* For Opera 11.1 to 12.0 */
    background: -moz-linear-gradient(right, #FFFFFF, #AAB1C5, #FFFFFF); /* For Firefox 3.6 to 15 */
    background: linear-gradient(to right, #FFFFFF, #AAB1C5, #FFFFFF); /* Standard syntax (must be last) */
    margin-top: 2px;
    margin-bottom: 2px;
  }

  &.selected {
    hr {
      background: linear-gradient(to right, #FFFFFF, #AAB1C5);
      background-color: #AAB1C5;
    }
  }
}

.alt {
}
</style>
