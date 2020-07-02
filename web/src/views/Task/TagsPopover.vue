<template>
  <Popover top="48px">
    <template>
      <div class="tag-input">
        <input type="text" placeholder="Search for tags…" class="input" v-model="tagInput"/>
      </div>
      <ul class="tags">
        <li class="tag" v-for="tag in filteredTags" :key="tag.label" @click="input(tag)">
          <div class="tag-color" :style="{background: tag.color}">
            {{tag.label}}
          </div>
        </li>
      </ul>
      <div class="tag-empty" v-if="!isIntentNewTag && filteredTags.length === 0">
        <div class="tag tag-null">
          You have no tags, create one by typing above
        </div>
      </div>
      <div class="tag-empty" v-if="isIntentNewTag">
        <div class="tag" @click="addTag">
          <div class="tag-color" :style="{background: colorInput}">
            New "{{tagInput}}"
          </div>
        </div>
        <div class="color-boxes">
          <div class="color-box" v-for="color in colors" :key="color" :style="{background: color}"
               @click="selectColor(color)" :class="{'checked': color === colorInput}"></div>
        </div>
      </div>
    </template>
    <template v-slot:trigger>
      <slot name="trigger"></slot>
    </template>
  </Popover>
</template>

<script lang="ts">
import { Component, Emit, Vue } from 'vue-property-decorator'
import Popover from '@/components/Popover.vue'
import { TagResource } from '@/types/resource'

@Component({
  name: 'TagsPopover',
  components: { Popover }
})
export default class TagsPopover extends Vue {
    private tagInput = ''
    private colorInput = this.colors[0]

    get tags (): TagResource[] {
      return this.$store.state.task.tag.data || []
    }

    get colors () {
      return ['#409240', '#29839f', '#b1a447', '#a05138', '#a73f5d', '#7d579f']
    }

    get filteredTags () {
      return this.tags.filter(tag => tag.label.toLowerCase().indexOf(this.tagInput.toLowerCase()) !== -1)
    }

    get isIntentNewTag () {
      const match = this.filteredTags.find(tag => tag.label.toLowerCase() === this.tagInput.toLowerCase())
      return !match && this.tagInput.trim().length > 0
    }

    async addTag () {
      await this.$store.dispatch('task/tag/create', {
        color: this.colorInput,
        label: this.tagInput
      } as TagResource)
      await this.$store.dispatch('task/tag/fetch', null)
      this.tagInput = ''
    }

    selectColor (color: string) {
      this.colorInput = color
    }

    @Emit('input')
    input (tag: TagResource) {
      return tag
    }
}
</script>

<style lang="postcss" scoped>

  .tag-input {
    @apply p-2;
  }

  .tags {
    @apply py-2;
    max-height: 30vh;
    overflow-y:auto;
  }

  .tag {
    @apply py-2 px-6;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      background: theme("colors.gray.100");
    }
  }
  .tag-null {
    @apply pb-3;
    font-size: 0.85rem;
    opacity: 0.5;
  }

  .tag-color {
    @apply p-2 rounded;
    color: #fff;
  }

  .tag-empty {

  }

  .color-boxes {
    @apply p-2;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto;
    grid-gap: 0.25rem;
  }

  .color-box {
    @apply rounded m-2;
    height: 32px;
    border: solid 4px transparent;
    transition:all 0.3s ease;
    cursor: pointer;
  }

  .color-box.checked {
    @apply shadow-outline;
    border: solid 4px theme("colors.gray.900");
  }

</style>
