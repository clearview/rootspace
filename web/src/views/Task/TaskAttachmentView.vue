<template>
  <div class="attachment">
    <div class="flex-initial" @click="viewAttachment">
      <div class="attachment-media" v-if="isAttachmentImage">
        <img :src="attachment.versions.thumbnail.location" :alt="attachment.id">
      </div>
      <div v-else class="attachment-media others">
        <legacy-icon
          name="file"
          size="3.5em"
          class="SelectNodeType-icon"
        />
      </div>
    </div>
    <div class="attachment-name">
      <span class="title" @click="viewAttachment">{{attachment.location | formatAttachmentName}}</span>
      <span class="date">
        Added {{attachment.createdAt | formatDate}}
      </span>
    </div>
    <div>
      <Popover :z-index="1001" top="38px" :with-close="false" position="bottom-start">>
        <template #default>
          <div class="action-line">
            <legacy-icon class="action-icon" name="download" viewbox="16" size="16px"></legacy-icon>
            <div class="action-line-text" @click="open(attachment.location)">
              Download
            </div>
          </div>

          <template v-if="!archivedView">
            <div class="action-separator"></div>

            <Popover
              sub
              :z-index="1010"
              :offset="20"
              :with-close="false"
              position="bottom-start"
              class="delete-attachment bottom"
            >
              <template #default="{ hide }">
                <div class="delete-confirmation">
                  <h3>Delete File</h3>

                  <p>File is about to be permanently deleted...</p>
                  <p>Warning: You can’t undo this action.</p>

                  <div class="delete-action">
                    <p @click="hide();">Cancel</p>
                    <button class="btn btn-primary" @click="handleMenu('delete')">
                      Delete
                    </button>
                  </div>
                </div>
              </template>
              <template #trigger="{ visible }">
                <div class="action-line danger" :class="{'btn-link-primary': visible}">
                  <legacy-icon name="archive" viewbox="16" size="16px"></legacy-icon>
                  <div class="action-line-text">
                    Delete
                  </div>
                </div>
              </template>
            </Popover>
          </template>

        </template>
        <template #trigger="{ visible }">
          <button class="btn btn-link" :class="{'btn-link-primary': visible}">
            <legacy-icon name="ellipsis" viewbox="20" size="1.25rem"/>
          </button>
        </template>
      </Popover>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'
import { NewUploadResource } from '@/types/resource'

import Popover from '@/components/Popover.vue'
import { formatRelativeToLower } from '@/utils/date'

  @Component({
    name: 'TaskAttachmentView',
    components: {
      Popover
    },
    filters: {
      formatAttachmentName (location: string) {
        const splits = location.split('/')
        return splits[splits.length - 1]
      },
      formatDate (date: Date | string) {
        const dueDate = date instanceof Date ? date : new Date(date)
        return formatRelativeToLower(dueDate, new Date())
      }
    }
  })
export default class TaskAttachmentView extends Vue {
    @Prop({ type: Object, required: true })
    private readonly attachment!: NewUploadResource;

    @Prop({ type: Number, required: true })
    private readonly index!: number;

    @Prop({ type: Boolean })
    private readonly archivedView!: boolean;

    private isShowImage = false

    @Emit('remove')
    remove (attachment: NewUploadResource) {
      return attachment
    }

    @Emit('attachmentClick')
    attachmentClick (index: number) {
      return index
    }

    async handleMenu (value: string) {
      switch (value) {
        case 'delete':
          this.remove(this.attachment)
          break
      }
    }

    get isAttachmentImage () {
      return ['image/jpg', 'image/jpeg', 'image/png'].indexOf(this.attachment.mimetype) !== -1
    }

    viewAttachment () {
      this.attachmentClick(this.index)
    }

    open (src: string) {
      window.open(src, '_blank')
    }
}
</script>

<style lang="postcss" scoped>
  .attachment {
    @apply mb-4 flex;
  }

  .attachment-media {
    cursor: pointer;

    img {
      @apply rounded;
      width: 80px;
      height: 64px;
      object-fit: cover;
    }

    &.others {
      @apply rounded flex items-center justify-center;

      width: 80px;
      height: 64px;
      background: rgba(theme("colors.gray.100"), 0.3);

      svg {
        color: theme("colors.gray.800");
      }
    }
  }

  .attachment-name {
    @apply flex-1 ml-2;

    color: theme("colors.gray.900");
    font-weight: bold;
    line-height: 17px;
    word-break: break-word;

    &::first-letter {
      text-transform: uppercase;
    }

    span.date {
      font-weight: normal;
      color: theme("colors.gray.800");
      display: block;
      padding-top: 4px
    }

    span.title {
      cursor: pointer;
    }
  }

  .btn-icon {
    @apply p-1;
    font-size: 12px;
  }

  .btn-link {
    background-color: unset !important;
    padding: 0;
    height: 20px;

    &:hover {
      background-color: unset;

      .stroke-current {
        color: theme("colors.primary.default");
      }
    }
  }

  /* .btn-link .stroke-current {
    stroke-width: 3px;
    color: theme("colors.gray.400");
  } */

  .action-line {
    @apply flex items-center py-2 px-4 my-1 relative;
    font-size: 13px;
    line-height: 16px;
    width: 168px;
    color: theme("colors.gray.900");
    stroke-width: 3px;
    cursor: pointer;

    &:hover{
      background: #F0F2F5;
    }
    &.danger {
      color: theme("colors.danger.default");
    }
  }

  .action-line-text {
    @apply ml-2;
    flex: 1 1 auto;
  }
  .action-separator{
    @apply my-1;
    height:1px;
    background: theme("colors.gray.100");
  }

  .delete-confirmation {
    width: 272px;
    padding: 16px;
    border-radius: 4px;

    h3 {
      font-size: 15px;
      line-height: 18px;
      font-weight: 600;
      margin-bottom: 8px;
    }

    p {
      font-size: 14px;
      line-height: 17px;
    }

    .delete-action {
      @apply flex items-center justify-end;

      margin-top: 16px;

      p {
        cursor: pointer;
        font-size: 14px;
        line-height: 17px;
        font-weight: bold;
        margin-right: 16px;
      }

      button {
        width: 104px;
        height: 32px;
        font-size: 14px;
        line-height: 17px;
        font-weight: bold;
        padding: 8px;
      }
    }
  }
</style>

<style lang="postcss">
.delete-attachment {
  .popover {
    border: 1px solid theme("colors.primary.default");

    &::before {
      content: "";
      width: 0px;
      height: 0px;
      border: 0.8em solid transparent;
      position: absolute;
    }

    &::after {
      content: "";
      width: 0px;
      height: 0px;
      border: 0.8em solid transparent;
      position: absolute;
    }
  }

  &.bottom {
    .popover {
      border: 1px solid theme("colors.primary.default");

      &::before {
        left: 15%;
        top: -21px;
        border-bottom: 10px solid theme("colors.primary.default");
      }

      &::after {
        left: 15%;
        top: -20px;
        border-bottom: 10px solid #FFF;
      }

      &[data-popper-placement="top-start"] {
        &::before {
          bottom: -11px;
          top: unset;
          border-bottom: unset;
          border-top: 10px solid theme("colors.primary.default");
        }

        &::after {
          bottom: -10px;
          top: unset;
          border-bottom: unset;
          border-top: 10px solid #FFF;
        }
      }
    }
  }

  &.left {
    .popover {
      border: 1px solid theme("colors.primary.default");

      &::before {
        left: -21px;
        top: 78%;
        border-right: 10px solid theme("colors.primary.default");
      }

      &::after {
        left: -20px;
        top: 78%;
        border-right: 10px solid #FFF;
      }

      &[data-popper-placement="left-end"] {
        &::before {
          right: -11px;
          left: unset;
          border-right: unset;
          border-left: 10px solid theme("colors.primary.default");
        }

        &::after {
          right: -10px;
          left: unset;
          border-right: unset;
          border-left: 10px solid #FFF;
        }
      }
    }
  }
}
</style>
