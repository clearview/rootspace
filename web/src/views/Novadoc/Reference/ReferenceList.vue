<template>
  <div class="cloak" @click.self="$emit('cancel')">
  <ul class="reference-list" :style="{top: coords.top+'px', left: coords.left + 5 + 'px'}">
    <li class="reference-search">
      <input type="text" v-model="search" placeholder="Search" ref="search" @keydown="handleKeypress"/>
    </li>
    <li class="reference" v-for="(reference, index) in filteredReferences" :key="reference.id+';'+index" :class="{selected: index === selectedIndex}" @click="$emit('confirm', reference)">
      <div class="icon">
        <v-icon viewbox="16" :name="getIcon(reference.type)"/>
      </div>
      <div class="label">{{ reference.title }}
      </div>
    </li>
    <li class="empty" v-if="filteredReferences.length === 0">
      No matching references found
    </li>
    <li class="help">
      Press esc to cancel, enter to choose
    </li>
  </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue } from 'vue-property-decorator'
import { NodeResource } from '../../../types/resource'
import { Optional } from '@/types/core'

const nodeIconNames: Record<string, string> = {
  link: 'link2',
  doc: 'file-empty',
  taskBoard: 'layout',
  embed: 'code',
  folder: 'folder-closed',
  archive: 'folder-closed'
}

@Component
export default class ReferenceList extends Vue {
  @Prop({ type: Array, required: true })
  private readonly references!: NodeResource[];

  @Prop({ type: Object, required: true })
  private readonly coords!: {top: number;left: number;bottom: number;right: number};

  @Ref('search')
  private readonly searchRef!: HTMLInputElement;

  private search = '';
  private selectedIndex = -1
  private flattennedReferences: Optional<NodeResource, 'children'>[] = []

  getIcon (type: string) {
    return nodeIconNames[type]
  }

  get filteredReferences () {
    const regex = new RegExp(this.search, 'i')
    return this.flattennedReferences.filter(reference => regex.test(reference.title))
  }

  mounted () {
    Vue.nextTick(() => {
      this.flattenReferences()
      this.searchRef.focus()
    })
  }

  flattenReferences () {
    this.flattennedReferences = []
    const iterateThrough = (node: NodeResource) => {
      for (const child of node.children) {
        iterateThrough(child)
      }
      this.flattennedReferences.push({ ...node, children: undefined })
    }
    for (const ref of this.references) {
      iterateThrough(ref)
    }
  }

  handleKeypress (evt: KeyboardEvent) {
    evt.stopPropagation()
    if (evt.key === 'ArrowDown') {
      evt.preventDefault()
      this.selectedIndex++
      if (this.selectedIndex > this.filteredReferences.length) {
        this.selectedIndex = 0
      }
    } else if (evt.key === 'ArrowUp') {
      evt.preventDefault()
      this.selectedIndex--
      if (this.selectedIndex < 0) {
        this.selectedIndex = this.filteredReferences.length
      }
    } else if (evt.key === 'Escape') {
      evt.preventDefault()
      this.$emit('cancel')
    } else if (evt.key === 'Enter') {
      evt.preventDefault()
      if (this.filteredReferences[this.selectedIndex]) {
        this.$emit('confirm', this.filteredReferences[this.selectedIndex])
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.cloak {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 50;
}
.reference-list {
  margin: 0;
  padding: 0;
  background: #fff;
  position: fixed;
  z-index: 5;
  color: #333;
  border-radius: 4px;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0,0,0,.1), 0 4px 8px rgba(0,0,0,.05);
}
.reference, .empty {
  padding: 6px;
  margin: 0;
  list-style: none;
  display: flex;
  align-items: center;
  &.selected, &:hover {
    background: #146493;
    color: #fff;
    .icon {
    }
    .label {
      color: #fff;
    }
  }
  .icon {
    flex: 0 0 auto;
    font-size: 24px;
    .stroke-current, .fill-current {
      fill: transparent;
    }
  }
  .label {
    flex: 1 1 auto;
    margin-left: 8px;
  }
}
.empty {
  opacity: 0.5;
}
.reference-search {
  list-style: none;
  padding: 6px;
}
.reference-search input{
  outline: none;
  background: transparent;
  padding: 6px;
  box-sizing: border-box;
  display: block;
}
.help {
  opacity: 0.75;
  padding: 6px;
  list-style: none;
  font-size: 12px;
}
</style>
