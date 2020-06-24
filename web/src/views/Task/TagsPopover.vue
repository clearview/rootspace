<template>
  <Popover top="48px">
    <template>
      <div class="tag-input">
        <input type="text" placeholder="Search for tags…" class="input" v-model="tagInput"/>
      </div>
      <ul class="tags">
        <li class="tag" v-for="tag in filteredTags" :key="tag.label">
          <div class="tag-color" :style="{background: tag.color}">
            {{tag.label}}
          </div>
        </li>
      </ul>
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
import { Component, Vue } from 'vue-property-decorator'
import Popover from '@/components/Popover.vue'

  @Component({
    name: 'TagsPopover',
    components: { Popover }
  })
export default class TagsPopover extends Vue {
    private tagInput = ''
    private colorInput = this.colors[0]

    private tags = [{
      label: 'A',
      color: '#c44'
    },
    {
      label: 'B',
      color: '#4c4'
    }, {
      label: 'C',
      color: '#44c'
    }]

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

    addTag () {
      this.tags.push({
        label: this.tagInput,
        color: this.colorInput
      })
      this.tagInput = ''
    }

    selectColor (color: string) {
      this.colorInput = color
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
