<template>
  <Popover
    :z-index="1001"
    :offset="5" position="bottom-start"
    :title="tagsTitle"
    :backButton="backButtonState"
    @back="backButtonAction"
    @hide="hideButtonAction">
  <template>
    <div class="manage-tags">
    <!-- <div class="tag-input">
      <input type="text" placeholder="Search for tags…" class="input" v-model="tagInput"/>
    </div> -->
    <Draggable tag="ul" class="tags" handle=".tag" v-model="tags" @change="reorder" v-bind="dragOptions" v-if="['list', 'manage'].includes(tagsState)">
      <li class="tag" v-for="(tag, index) in filteredTags" :key="`${tag.label}-new-${index}`">
        <div class="container-tag" :draggable="canDrag">
          <div class="drag" v-if="canDrag">
            <mono-icon name="drag"/>
          </div>
          <div :style="{background: tag.color, color: textColor(tag.color)}" :class="{ 'manage': tagsState === 'manage'}" class="tag-color"
            @click="tagsState !== 'manage' ? input(tag) : null">
            {{tag.label}}
            <span class="icon-checkmark" v-if="isSelectedTag(tag) && tagsState !== 'manage'">
              <legacy-icon size="9.33 6.67" name="checkmark" viewbox="12 9" />
            </span>
          </div>
          <div class="action" v-if="tagsState === 'manage'">
          <span id="edit-button" @click="editTagButton(tag)" content="Edit" v-tippy>
              <legacy-icon size="1rem" viewbox="32" name="edit"/>
          </span>
          <span id="delete-button" @click="deleteTagButton(tag)" class="delete" content="Delete" v-tippy>
            <legacy-icon size="1rem" viewbox="32" name="trash"/>
          </span>
          </div>
        </div>
      </li>
    </Draggable>
    <div class="tag-empty" v-if="filteredTags.length === 0 && tagsState !== 'add' && tagsState !== 'edit'">
      <div class="tag tag-null">
        You don’t have any tags, please click “Add Tag” to create one
      </div>
    </div>
    <div class="add-tag" v-show="['add', 'edit'].includes(tagsState)">
      <h4 class="tag-subtitle">Tag name</h4>
      <input
        ref="input"
        type="text"
        class="input"
        placeholder="Enter name"
        v-model="tagInput"
        required
        @keyup.enter="saveTag"
      >

      <h4 class="tag-subtitle">Select tag color</h4>
      <div class="color-boxes">
      <div class="color-box" v-for="color in colors" :key="color" :style="{ background: color }"
        @click="selectColor(color)" :class="{'checked': color === colorInput}">
        <span class="icon-checkmark"><legacy-icon size="8px" name="checkmark" viewbox="12" /></span>
      </div>
      </div>

      <button @click="saveTag" :disabled="!tagInput" class="btn btn-small btn-primary tag-button">{{ saveButtonText }}</button>
    </div>
    <!-- <div class="tag-empty" v-if="isIntentNewTag">
      <div class="tag" >
      <div class="tag-color" :style="{background: opacityColor(colorInput), color: colorInput}">
        New "{{tagInput}}"
      </div>
      </div>
      <div class="color-boxes">
      <div class="color-box" v-for="color in colors" :key="color" :style="{background: opacityColor(color)}"
        @click="selectColor(color)" :class="{'checked': color === colorInput}"></div>
      </div>
    </div> -->

    <div class="manage-button" @click="manageTagsButton()" v-if="showManageTagButton()">
      <span><legacy-icon name="edit" size="16" viewbox="32"/></span>
      Manage Tags
    </div>
    <div class="add-button" @click="addTagButton()" v-if="showAddTagButton()">
      <span><legacy-icon name="plus2" size="16" viewbox="16"/></span>
      Add Tag
    </div>
    </div>
  </template>
  <template v-slot:trigger>
    <slot name="trigger"></slot>
  </template>
  </Popover>
</template>

<script lang="ts">
import Draggable from 'vuedraggable'

import { Component, Emit, Vue, Prop, Ref } from 'vue-property-decorator'
import Popover from '@/components/Popover.vue'
import { TagResource } from '@/types/resource'

@Component({
  name: 'TagsPopover',
  components: { Popover, Draggable }
})
export default class TagsPopover extends Vue {
  @Prop({ type: Array, required: true })
  private readonly selectedTags!: TagResource[];

  @Ref('input')
  private readonly inputRef!: HTMLInputElement;

  private tags: TagResource[] = []
  private tagInput = ''
  private idEditedTag: number | null = null
  private colorInput = this.colors[0]
  private backButtonState = false
  private tagsTitle = 'Select Tag'
  private tagsState = 'list'
  private saveButtonText = 'Add Tag'
  private testTags = [
    {
      boardId: 8,
      color: '#DEFFD9',
      id: 1,
      label: 'Tag 1',
      position: 0
    },
    {
      boardId: 8,
      color: '#FFE8E8',
      id: 2,
      label: 'Tag 2',
      position: 0
    },
    {
      boardId: 8,
      color: '#DBF8FF',
      id: 3,
      label: 'Tag 3',
      position: 0
    }
  ]

  get colors () {
    return ['#DEFFD9', '#FFE8E8', '#FFEAD2', '#DBF8FF', '#F6DDFF', '#FFF2CC', '#FFDDF1', '#DFE7FF', '#D5D1FF', '#D2E4FF']
  }

  get filteredTags () {
    return this.tags.sort((a: any, b: any) => a.position - b.position)
  }

  get dragOptions () {
    const isFirefox = navigator.userAgent.indexOf('Firefox') !== -1
    return {
      group: 'tags',
      disabled: !this.canDrag,
      ghostClass: 'ghost',
      forceFallback: !isFirefox,
      fallbackOnBody: true,
      fallbackClass: 'ghost-floating'
    }
  }

  get canDrag () {
    return this.tagsState === 'manage'
  }

  // get isIntentNewTag () {
  //   const match = this.filteredTags.find(tag => tag.label.toLowerCase() === this.tagInput.toLowerCase())
  //   return !match && this.tagInput.trim().length > 0
  // }

  get originTags () {
    return this.$store.state.task.tag.data.map((tag: TagResource) => ({
      ...tag,
      position: tag.position || 0
    }))
  }

  mounted () {
    this.tags = this.originTags
  }

  async saveTag () {
    if (!this.tagInput) return

    const data = {
      color: this.colorInput,
      label: this.tagInput
    } as TagResource
    if (this.tagsState === 'edit') {
      const url = 'task/tag/updateTag'
      const item = await this.$store.dispatch(url, {
        tagId: this.idEditedTag,
        data: data
      } as object)

      this.$emit('update', {
        ...data,
        ...item
      })

      this.tagInput = ''
      this.tagsTitle = 'Manage Tags'
      this.tagsState = 'manage'
    } else {
      const url = 'task/tag/create'
      const item = await this.$store.dispatch(url, data)

      this.$emit('create', {
        ...data,
        ...item
      })

      this.tagInput = ''
      this.tagsState = 'list'
      this.tagsTitle = 'Select Tag'
    }
  }

  private async reorder () {
    // fill position by actual array index
    const tagsPosition: TagResource[] = this.tags.map((tag: TagResource, index: number) => ({ ...tag, position: index }))
    // const changedTags = this.tags.filter((tag: TagResource) => !this.originTags.some((originTag: TagResource) => tag === originTag))

    await this.$store.dispatch('task/tag/reorderTags', { data: tagsPosition })

    // await this.$store.dispatch('task/item/update', {
    //   id,
    //   listId,
    //   position: newPos
    // })

    // this.doc.doc.transact(() => {
    //   this.doc.set(this.taskId, {
    //     clientId: this.clientId,
    //     action: 'listLaneMoved',
    //     id: data.moved.element.id,
    //     position: newPos
    //   })
    // }, this.clientId)
  }

  selectColor (color: string) {
    this.colorInput = color
  }

  showAddTagButton (): boolean {
    return (this.filteredTags.length === 0) || (this.tagsState === 'manage')
  }

  showManageTagButton (): boolean {
    return (this.filteredTags.length !== 0) && (this.tagsState === 'list')
  }

  manageTagsButton () {
    this.backButtonState = true
    this.tagsTitle = 'Manage Tags'
    this.tagsState = 'manage'
  }

  addTagButton () {
    this.backButtonState = true
    this.tagsTitle = 'Add Tag'
    this.saveButtonText = 'Add Tag'
    this.tagsState = 'add'
    Vue.nextTick(() => {
      this.inputRef.focus()
    })
  }

  editTagButton (tagVal: TagResource) {
    this.backButtonState = true
    this.tagsTitle = 'Edit Tag'
    this.saveButtonText = 'Save'
    this.tagsState = 'edit'

    this.colorInput = tagVal.color
    this.tagInput = tagVal.label
    this.idEditedTag = tagVal.id
    Vue.nextTick(() => {
      this.inputRef.focus()
    })
  }

  async deleteTagButton (tagVal: TagResource) {
    const url = 'task/tag/deleteTag'
    await this.$store.dispatch(url, {
      tagId: tagVal.id
    } as object)
    await this.$store.dispatch('task/tag/fetch', null)
    await this.$store.dispatch('task/board/refresh')
  }

  backButtonAction (val: boolean) {
    switch (this.tagsState) {
      case 'manage':
        this.tagsState = 'list'
        this.tagsTitle = 'Select Tag'
        this.backButtonState = val
        break

      case 'add':
        this.tagsState = 'manage'
        this.tagsTitle = 'Manage Tags'
        this.tagInput = ''
        break

      case 'edit':
        this.tagsState = 'manage'
        this.tagsTitle = 'Manage Tags'
        this.tagInput = ''
        break

      default:
        break
    }
  }

  hideButtonAction (val: boolean) {
    if (val) {
      this.tagsState = 'list'
      this.tagsTitle = 'Select Tag'
      this.backButtonState = false
    }
  }

  textColor (bgColor: string) {
    const textColor = ['#3A932C', '#C94747', '#DD8435', '#588f9c', '#9C3DBF', '#8c7940', '#883b68', '#394c84', '#47408c', '#2D6FD6']
    const getBgPosition = this.colors.indexOf(bgColor)

    return textColor[getBgPosition]
  }

  isSelectedTag (tag: TagResource) {
    return this.selectedTags?.find(itemTag => itemTag.id === tag.id)
  }

  @Emit('input')
  input (tag: TagResource) {
    return tag
  }
}
</script>

<style lang="postcss" scoped>
  .manage-tags {
    width: 240px;
    padding: 1rem;
    padding-top: 0;
  }
  .tag-input {
    @apply p-2;
  }

  .tags {
    overflow-y:auto;
  }

  .tag {
    @apply py-1;
    transition: all 0.3s ease;
  }
  .tag-null {
    @apply pb-6;
    font-size: 14px;
    opacity: 0.5;
  }

  .tag-color {
    @apply p-2 rounded flex-grow self-center;

    font-size: 11px;
    line-height: 12px;
    letter-spacing: 0.03em;
    text-align: left;
    color: #FFF;
    position: relative;
    text-transform: uppercase;
    font-weight: bold;
    border-left: 0px solid;
    padding-left: 12px;

    .icon-checkmark {
      position: absolute;
      right: 10px;
      opacity: 1;
      top: 6px;
    }

    &:hover {
      border-left: 4px solid;
      padding-left: 8px;
    }

    &.manage {
      cursor: grab;
    }
  }

  .tag-empty {

  }

  .color-boxes {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: auto;
    grid-gap: 0.25rem;
  }

  .color-box {
    @apply flex rounded-full m-1;

    width: 32px;
    height: 32px;
    transition:all 0.3s ease;
    cursor: pointer;
    position: relative;

    .icon-checkmark {
      visibility: hidden;
      opacity: 0;
      margin: 0 auto;

      svg {
        margin-top: 2px;
      }
    }
  }

  .color-box.checked {
    .icon-checkmark {
      visibility: visible;
      opacity: 1;
      top: 7px;
      left: 7px;
      width: 18px;
      height: 18px;
    }
  }

  .manage-button,
  .add-button {
    @apply flex items-center;

    cursor: pointer;
    padding-top: 16px;
    font-weight: bold;
    font-size: 12px;
    line-height: 14px;
    color: theme("colors.gray.400");

    &:hover {
      color: theme("colors.gray.800");
    }

    span {
      @apply pr-2;
    }
  }

  .add-button {
    margin-top: -5px;
  }

  .container-tag {
    @apply flex content-center;

    .action {
      @apply flex content-center pl-1;

      span {
        @apply p-1;

        cursor: pointer;

        &.delete {
          color: theme("colors.danger.default");
        }
      }

      svg, path {
        pointer-events: none;
      }
    }

    &:hover {
      .drag {
        opacity: 100%;
      }
    }
  }

  .input {
  @apply w-full mb-4;
  }

  .tag-subtitle {
  @apply pb-2;

  font-size: 14px;
  line-height: 17px;
  color: theme("colors.gray.800");
  }

  .tag-button {
  @apply my-4;

  float: right
  }

  .drag {
    cursor: grab;
    font-size: 20px;
    color: #a7b2cf;
    opacity: 25%;
  }

  .drag .stroke-current{
    stroke: none;
  }

  .ghost {
    opacity: 0.5;
    background: theme("colors.gray.100");
    .action {
      opacity: 0;
    }
  }

  .ghost-floating {
    opacity: 0 !important;
  }
</style>
