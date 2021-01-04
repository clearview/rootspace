<template>
  <div class="cloak" @click.self="$emit('cancel')">
    <ul class="reference-list" :style="{top: coords.top+'px', left: coords.left + 5 + 'px'}">
      <li class="reference-search">
        <v-icon name="search" size="16px" class="search-icon"></v-icon>
        <input type="text" v-model="search" placeholder="Search" ref="search" @keydown="handleKeypress"/>
      </li>
      <div class="scrollview">
        <li class="group" v-for="(key, groupIndex) in Object.keys(filteredReferences)" :key="`${key};${groupIndex}`">
          <div class="group-title">
            {{ groupKeyToLabel(key) }}
          </div>
          <ul class="references">
            <li class="reference" v-for="(reference, index) in filteredReferences[key]"
                :key="`${reference.id};${index}`"
                :class="{selected: index === selectedIndex && groupIndex === selectedGroupIndex}"
                @click="$emit('confirm', reference)">
              <div class="icon">
                <v-icon viewbox="16" :name="getIcon(reference.type)"/>
              </div>
              <div class="label">{{ reference.title }}
              </div>
            </li>
          </ul>
        </li>
      </div>
      <li class="empty" v-if="Object.keys(filteredReferences).length === 0">
        No matching references found
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
  private readonly coords!: { top: number; left: number; bottom: number; right: number };

  @Ref('search')
  private readonly searchRef!: HTMLInputElement;

  private search = '';
  private selectedIndex = -1;
  private selectedGroupIndex = 0;
  private flattennedReferences: Optional<NodeResource, 'children'>[] = [];

  getIcon (type: string) {
    return nodeIconNames[type]
  }

  get filteredReferences () {
    const regex = new RegExp(this.search, 'i')
    const filtered = this.flattennedReferences.filter(reference => regex.test(reference.title))
    const groups: Record<string, Optional<NodeResource, 'children'>[]> = {}
    for (const item of filtered) {
      if (!groups[item.type]) {
        groups[item.type] = []
      }
      groups[item.type].push(item)
    }
    return groups
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
    const groups = Object.keys(this.filteredReferences)
    if (evt.key === 'ArrowDown') {
      evt.preventDefault()
      this.selectedIndex++
      if (this.filteredReferences[groups[this.selectedGroupIndex]] && this.selectedIndex >= this.filteredReferences[groups[this.selectedGroupIndex]].length) {
        this.selectedGroupIndex++
        if (this.selectedGroupIndex >= groups.length) {
          this.selectedGroupIndex = 0
        }
        this.selectedIndex = 0
      }
    } else if (evt.key === 'ArrowUp') {
      evt.preventDefault()
      this.selectedIndex--
      if (this.filteredReferences[groups[this.selectedGroupIndex]] && this.selectedIndex < 0) {
        this.selectedGroupIndex--
        if (this.selectedGroupIndex < 0) {
          this.selectedGroupIndex = groups.length - 1
        }
        this.selectedIndex = this.filteredReferences[groups[this.selectedGroupIndex]].length - 1
      }
    } else if (evt.key === 'Escape' || evt.key === 'Tab') {
      evt.preventDefault()
      this.$emit('cancel')
    } else if (evt.key === 'Enter') {
      evt.preventDefault()
      if (this.filteredReferences[groups[this.selectedGroupIndex]][this.selectedIndex]) {
        this.$emit('confirm', this.filteredReferences[groups[this.selectedGroupIndex]][this.selectedIndex])
      }
    } else {
      this.selectedGroupIndex = 0
      this.selectedIndex = 0
    }
  }

  groupKeyToLabel (key: string) {
    switch (key) {
      case 'doc':
        return 'Documents'
      case 'taskBoard':
        return 'Task Boards'
      case 'link':
        return 'Links'
      case 'embed':
        return 'Embeds'
      case 'folder':
        return 'Folders'
      default:
        return 'Unknown'
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
  color: #2C2B35;
  border-radius: 4px;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .1), 0 4px 8px rgba(0, 0, 0, .05);
  width: 224px;
}

.group {
  list-style: none;
  margin: 0;
  padding: 0;

  .group-title {
    padding: 8px 16px;
    text-transform: uppercase;
    color: #444754;
    font-weight: bold;
    font-size: 11px;
    line-height: 14px;
  }
}

.reference, .empty {
  padding: 8px 16px;
  margin: 0;
  list-style: none;
  display: flex;
  align-items: center;
  font-size: 13px;
  line-height: 16px;
  color: #2C2B35;
  cursor: pointer;

  &.selected, &:hover {
    background: #F4F5F7;

    .icon {
    }

    .label {
      color: #2C2B35;
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
    color: #2C2B35;
  }
}

.empty {
  opacity: 0.5;
}

.reference-search {
  list-style: none;
  padding: 8px;
  margin: 0;
  position: relative;
}

.search-icon {
  position: absolute;
  top: 19px;
  left: 16px;
}

.reference-search input {
  outline: none;
  background: transparent;
  padding: 8px 8px 8px 32px;
  box-sizing: border-box;
  display: block;
  border: solid 2px transparent;
  border-radius: 4px;
  width: 100%;

  &:active, &:focus {
    border: 2px solid #8CD5FF;
  }
}

.help {
  margin: 0;
  opacity: 0.75;
  padding: 8px;
  list-style: none;
  font-size: 12px;
}

.scrollview {
  max-height: 400px;
  overflow-y: scroll;
}
</style>
