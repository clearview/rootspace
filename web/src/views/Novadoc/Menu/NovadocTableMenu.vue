<template>
  <NovadocMenu class="novadoc-table-menu">
    <template v-if="isExpanded">
      <NovadocMenuButton
        @click="addRow"
        @mouseover.native="toggleAddRowPreview(true)"
        @mouseout.native="toggleAddRowPreview(false)"
      >
        <legacy-icon name="row-add" viewbox="18 16" size="16"></legacy-icon>
        <span>Row</span>
        <template #hover>
          <legacy-icon name="add-green" viewbox="16 16" size="16"></legacy-icon>
          <span>Row</span>
        </template>
      </NovadocMenuButton>
      <NovadocMenuButton
        @click="addCol"
        no-margin
        @mouseover.native="toggleAddColPreview(true)"
        @mouseout.native="toggleAddColPreview(false)"
      >
        <legacy-icon name="column-add" viewbox="18 16" size="16"></legacy-icon>
        <span>Column</span>
        <template #hover>
          <legacy-icon name="add-green" viewbox="16 16" size="16"></legacy-icon>
          <span>Column</span>
        </template>
      </NovadocMenuButton>
      <NovadocMenuSeparator></NovadocMenuSeparator>
      <NovadocMenuButton
        @click="removeRow"
        @mouseover.native="toggleDelRowPreview(true)"
        @mouseout.native="toggleDelRowPreview(false)"
      >
        <legacy-icon name="row-remove" viewbox="18 16" size="16"></legacy-icon>
        <span>Row</span>
        <template #hover>
          <legacy-icon
            name="remove-red"
            viewbox="16 16"
            size="16"
          ></legacy-icon>
          <span>Row</span>
        </template>
      </NovadocMenuButton>
      <NovadocMenuButton
        @click="removeCol"
        no-margin
        @mouseover.native="toggleDelColPreview(true)"
        @mouseout.native="toggleDelColPreview(false)"
      >
        <legacy-icon
          name="column-remove"
          viewbox="18 16"
          size="16"
        ></legacy-icon>
        <span>Column</span>
        <template #hover>
          <legacy-icon
            name="remove-red"
            viewbox="16 16"
            size="16"
          ></legacy-icon>
          <span>Column</span>
        </template>
      </NovadocMenuButton>
      <NovadocMenuSeparator></NovadocMenuSeparator>
      <NovadocMenuButton @click="api.mergeCells" no-margin>
        <legacy-icon name="merge" viewbox="16 16" size="16"></legacy-icon>
        <span>Merge</span>
      </NovadocMenuButton>
      <NovadocMenuSeparator></NovadocMenuSeparator>
      <NovadocMenuButton
        @click="makeStriped"
        no-margin
        class="striped-button"
        :class="{ active: striped }"
      >
        <legacy-icon name="striped" viewbox="16 16" size="16"></legacy-icon>
        <span>Striped</span>
      </NovadocMenuButton>
      <NovadocMenuSeparator></NovadocMenuSeparator>
      <NovadocMenuButton
        @click="api.deleteTable"
        @mouseover.native="markDeletion(true)"
        @mouseout.native="markDeletion(false)"
      >
        <legacy-icon name="trash-archive" viewbox="16" size="16"></legacy-icon>
        <span>Delete</span>
      </NovadocMenuButton>
    </template>
    <NovadocMenuButton @click="toggleExpand">
      <legacy-icon
        v-if="!isExpanded"
        name="left"
        viewbox="32"
        size="16"
      ></legacy-icon>
      <legacy-icon v-else name="close" viewbox="32" size="16"></legacy-icon>
    </NovadocMenuButton>

    <div
      class="overlay"
      ref="cellOverlay"
      v-show="overlay.visible"
      :style="overlay.style"
    />
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
      overlay: {
        visible: false,
        style: {
          background: null,
          top: null,
          left: null,
          width: null,
          height: null
        }
      }
    }
  },
  computed: {
    tableElement () {
      return this.$el.closest('table')
    },
    tableRowElement () {
      const { selection } = this.editor.state

      if (!selection) throw new Error('Selection is not found')

      const pos = selection.$from.start(selection.$from.depth - 2)
      const elm = this.editor.view.domAtPos(pos)

      return elm.node
    },
    tableColElement () {
      const { selection } = this.editor.state

      if (!selection) throw new Error('Selection is not found')

      const pos = selection.$from.start(selection.$from.depth - 1)
      const elm = this.editor.view.domAtPos(pos)

      return elm.node
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
    addRow () {
      this.api.addRowAfter()
      this.toggleAddRowPreview(false)
    },
    removeRow () {
      this.api.deleteRow()
      this.toggleDelRowPreview(false)
    },
    addCol () {
      this.api.addColumnAfter()
      this.toggleAddColPreview(false)
    },
    removeCol () {
      this.api.deleteColumn()
      this.toggleDelColPreview(false)
    },
    toggleAddRowPreview (show) {
      if (show) {
        try {
          const { x, y, width, height } = this.tableRowElement.getBoundingClientRect()

          this.overlay = {
            visible: true,
            style: {
              background: '#8cd5ff',
              left: x + 'px',
              top: y + height + 1 + 'px',
              width: width + 'px',
              height: 2 + 'px'
            }
          }
        } catch (e) { }
      } else {
        this.overlay.visible = false
      }
    },
    toggleDelRowPreview (show) {
      if (show) {
        try {
          const { x, y, width, height } = this.tableRowElement.getBoundingClientRect()

          this.overlay = {
            visible: true,
            style: {
              background: '#E22F2F',
              left: x + 'px',
              top: y + 'px',
              width: width + 'px',
              height: height + 'px'
            }
          }
        } catch (e) { }
      } else {
        this.overlay.visible = false
      }
    },
    toggleAddColPreview (show) {
      if (show) {
        try {
          const { y, height } = this.tableElement.getBoundingClientRect()
          const { x, width } = this.tableColElement.getBoundingClientRect()

          this.overlay = {
            visible: true,
            style: {
              background: '#8cd5ff',
              left: x + width + 1 + 'px',
              top: y + 'px',
              width: 2 + 'px',
              height: height + 'px'
            }
          }
        } catch (e) { }
      } else {
        this.overlay.visible = false
      }
    },
    toggleDelColPreview (show) {
      if (show) {
        try {
          const { y, height } = this.tableElement.getBoundingClientRect()
          const { x, width } = this.tableColElement.getBoundingClientRect()

          this.overlay = {
            visible: true,
            style: {
              background: '#E22F2F',
              left: x + 'px',
              top: y + 'px',
              width: width + 'px',
              height: height + 'px'
            }
          }
        } catch (e) { }
      } else {
        this.overlay.visible = false
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.table-menu-container {
}
.novadoc-table-menu {
  position: absolute;
  top: -40px;
  right: 0;
  z-index: 10;
  .fill-current {
    fill: transparent;
  }
  &:active,
  &.active {
    .fill-current {
      fill: transparent;
    }
  }
}

.striped-button {
  .fill-current {
    color: #aab1c5;
  }
  &.active .fill-current,
  &:active .fill-current {
    color: #146493;
  }
}

.overlay {
  position: fixed;
  background: red;
  opacity: .25;
}
</style>
<style lang="postcss">
.add-row-preview,
.add-col-preview {
  position: absolute;
  z-index: 100;
  background: #8cd5ff;
}
.del-row-preview,
.del-col-preview {
  position: absolute;
  z-index: 100;
  background: rgb(226, 47, 47);
}
</style>
