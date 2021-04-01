<template>
  <NovadocMenu class="novadoc-table-menu">
    <template v-if="isExpanded">
      <NovadocMenuButton @click="api.addRowAfter"
                         @mouseover.native="toggleAddRowPreview(true)" @mouseout.native="toggleAddRowPreview(false)">
        <legacy-icon name="row-add" viewbox="18 16" size="16"></legacy-icon> <span>Row</span>
        <template #hover>
          <legacy-icon name="add-green" viewbox="16 16" size="16"></legacy-icon> <span>Row</span>
        </template>
      </NovadocMenuButton>
      <NovadocMenuButton @click="api.addColumnAfter" no-margin
                         @mouseover.native="toggleAddColPreview(true)" @mouseout.native="toggleAddColPreview(false)">
        <legacy-icon name="column-add" viewbox="18 16" size="16"></legacy-icon> <span>Column</span>
        <template #hover>
          <legacy-icon name="add-green" viewbox="16 16" size="16"></legacy-icon> <span>Column</span>
        </template>
      </NovadocMenuButton>
      <NovadocMenuSeparator></NovadocMenuSeparator>
      <NovadocMenuButton @click="api.deleteRow"
                         @mouseover.native="toggleDelRowPreview(true)" @mouseout.native="toggleDelRowPreview(false)">
        <legacy-icon name="row-remove" viewbox="18 16" size="16"></legacy-icon> <span>Row</span>
        <template #hover>
          <legacy-icon name="remove-red" viewbox="16 16" size="16"></legacy-icon> <span>Row</span>
        </template>
      </NovadocMenuButton>
      <NovadocMenuButton @click="api.deleteColumn" no-margin
                         @mouseover.native="toggleDelColPreview(true)" @mouseout.native="toggleDelColPreview(false)">
        <legacy-icon name="column-remove" viewbox="18 16" size="16"></legacy-icon> <span>Column</span>
        <template #hover>
          <legacy-icon name="remove-red" viewbox="16 16" size="16"></legacy-icon> <span>Column</span>
        </template>
      </NovadocMenuButton>
      <NovadocMenuSeparator></NovadocMenuSeparator>
      <NovadocMenuButton @click="api.mergeCells" no-margin>
        <legacy-icon name="merge" viewbox="16 16" size="16"></legacy-icon> <span>Merge</span>
      </NovadocMenuButton>
      <NovadocMenuSeparator></NovadocMenuSeparator>
      <NovadocMenuButton @click="makeStriped" no-margin class="striped-button" :class="{active: striped}">
        <legacy-icon name="striped" viewbox="16 16" size="16"></legacy-icon> <span>Striped</span>
      </NovadocMenuButton>
      <NovadocMenuSeparator></NovadocMenuSeparator>
      <NovadocMenuButton @click="api.deleteTable" @mouseover.native="markDeletion(true)" @mouseout.native="markDeletion(false)">
        <legacy-icon name="trash-archive" viewbox="16" size="16"></legacy-icon> <span>Delete</span>
      </NovadocMenuButton>
    </template>
    <NovadocMenuButton @click="toggleExpand">
      <legacy-icon v-if="!isExpanded" name="left" viewbox="32" size="16"></legacy-icon>
      <legacy-icon v-else name="close" viewbox="32" size="16"></legacy-icon>
    </NovadocMenuButton>
  </NovadocMenu>
</template>

<script>

import NovadocMenu from '@/views/Novadoc/Menu/NovadocMenu'
import NovadocMenuButton from '@/views/Novadoc/Menu/NovadocMenuButton'
import NovadocMenuSeparator from '@/views/Novadoc/Menu/NovadocMenuSeparator'

export default {
  components: {
    NovadocMenuSeparator,
    NovadocMenuButton,
    NovadocMenu
  },
  props: ['editor', 'view', 'api'],
  name: 'NovadocTableMenu',
  data () {
    return {
      isExpanded: false,
      striped: false,
      deletion: false,
      addRowPreview: null,
      delRowPreview: null,
      addColPreview: null,
      delColPreview: null
    }
  },
  updated () {
    if (this.$el.closest('table')) {
      this.striped = this.$el.closest('table').classList.contains('striped')
    }
  },
  methods: {
    toggleExpand () {
      this.isExpanded = !this.isExpanded
    },
    makeStriped () {
      this.striped = !this.striped
      if (this.striped) {
        this.$el.closest('table').classList.add('striped')
      } else {
        this.$el.closest('table').classList.remove('striped')
      }
    },
    markDeletion (value) {
      this.deletion = value
      if (value) {
        this.$el.closest('table').classList.add('deletion')
      } else {
        this.$el.closest('table').classList.remove('deletion')
      }
    },
    toggleAddRowPreview (value) {
      if (value) {
        const sel = this.editor.state.selection
        if (sel) {
          const { $from } = sel
          const rowPos = $from.start($from.depth - 2)
          const rowDom = this.editor.view.domAtPos(rowPos)
          const dom = rowDom.node
          const rect = dom.getBoundingClientRect()
          if (!this.addRowPreview) {
            this.addRowPreview = document.createElement('div')
            this.addRowPreview.setAttribute('class', 'add-row-preview')
            document.body.appendChild(this.addRowPreview)
          }
          this.addRowPreview.style.display = 'block'
          this.addRowPreview.style.left = rect.x + 'px'
          this.addRowPreview.style.top = rect.y + rect.height + 1 + 'px'
          this.addRowPreview.style.width = rect.width + 'px'
          this.addRowPreview.style.height = 2 + 'px'
        }
      } else {
        if (this.addRowPreview) {
          this.addRowPreview.style.display = 'none'
        }
      }
    },
    toggleDelRowPreview (value) {
      if (value) {
        const sel = this.editor.state.selection
        if (sel) {
          const { $from } = sel
          const rowPos = $from.start($from.depth - 2)
          const rowDom = this.editor.view.domAtPos(rowPos)
          const dom = rowDom.node
          const rect = dom.getBoundingClientRect()
          if (!this.delRowPreview) {
            this.delRowPreview = document.createElement('div')
            this.delRowPreview.setAttribute('class', 'del-row-preview')
            document.body.appendChild(this.delRowPreview)
          }
          this.delRowPreview.style.display = 'block'
          this.delRowPreview.style.left = rect.x + 'px'
          this.delRowPreview.style.top = rect.y + 'px'
          this.delRowPreview.style.width = rect.width + 'px'
          this.delRowPreview.style.height = rect.height + 'px'
        }
      } else {
        if (this.delRowPreview) {
          this.delRowPreview.style.display = 'none'
        }
      }
    },
    toggleAddColPreview (value) {
      if (value) {
        const sel = this.editor.state.selection
        if (sel) {
          const { $from } = sel
          const colPos = $from.start($from.depth - 1)
          const colDom = this.editor.view.domAtPos(colPos)
          const dom = colDom.node
          const table = dom.closest('table')
          const rect = dom.getBoundingClientRect()
          const tableRect = table.getBoundingClientRect()
          if (!this.addColPreview) {
            this.addColPreview = document.createElement('div')
            this.addColPreview.setAttribute('class', 'add-col-preview')
            document.body.appendChild(this.addColPreview)
          }
          this.addColPreview.style.display = 'block'
          this.addColPreview.style.left = rect.x + rect.width + 1 + 'px'
          this.addColPreview.style.top = tableRect.y + 'px'
          this.addColPreview.style.width = 2 + 'px'
          this.addColPreview.style.height = tableRect.height + 'px'
        }
      } else {
        if (this.addColPreview) {
          this.addColPreview.style.display = 'none'
        }
      }
    },
    toggleDelColPreview (value) {
      if (value) {
        const sel = this.editor.state.selection
        if (sel) {
          const { $from } = sel
          const colPos = $from.start($from.depth - 1)
          const colDom = this.editor.view.domAtPos(colPos)
          const dom = colDom.node
          const table = dom.closest('table')
          const rect = dom.getBoundingClientRect()
          const tableRect = table.getBoundingClientRect()
          if (!this.delColPreview) {
            this.delColPreview = document.createElement('div')
            this.delColPreview.setAttribute('class', 'del-col-preview')
            document.body.appendChild(this.delColPreview)
          }
          this.delColPreview.style.display = 'block'
          this.delColPreview.style.left = rect.x + 'px'
          this.delColPreview.style.top = tableRect.y + 'px'
          this.delColPreview.style.width = rect.width + 'px'
          this.delColPreview.style.height = tableRect.height + 'px'
        }
      } else {
        if (this.delColPreview) {
          this.delColPreview.style.display = 'none'
        }
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.table-menu-container{

}
.novadoc-table-menu {
  position: absolute;
  top: -40px;
  right: 0;
  z-index: 10;
  .fill-current {
    fill: transparent;
  }
  &:active, &.active {
    .fill-current {
      fill: transparent;
    }
  }
}

.striped-button {
  .fill-current {
    color: #AAB1C5;
  }
  &.active .fill-current, &:active .fill-current {
    color: #146493;
  }
}
</style>
<style lang="postcss">
.add-row-preview, .add-col-preview {
  position: absolute;
  z-index: 100;
  background: #8CD5FF;
}
.del-row-preview, .del-col-preview {
  position: absolute;
  z-index: 100;
  background: rgba(226, 47, 47, 0.25);
}
</style>
