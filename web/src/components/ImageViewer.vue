<template>
  <Modal
    title="Image"
    :visible="visible"
    noheader
    nosubmit
    nofooter
    cancel-text="Okay"
    portal="secondary"
    :z-index="2000"
    @cancel="close"
    :modalStyle="{ 'background-color': 'rgb(68 71 84 / 0.97)' }"
    :contentStyle="{ 'background-color': 'unset', height: '65%', boxShadow: 'none' }"
  >
      <div class="task-modal-body">
        <span class="close" @click="close">
          <legacy-icon
            name="close"
            title="Close"
            size="32"
            viewbox="32"
          />
        </span>
        <div class="image-container">
          <div class="image-nav" v-if="images[index]">
              <span class="previous" :class="{'cursor-not-allowed': index === 0}" @click="prev">
                <legacy-icon
                  name="left"
                  size="40px"
                  viewbox="40"
                  title="Previous"
                  id="doc-share-button-svg-first"
                />
              </span>

              <div class="image-box" v-if="isAttachmentImage(images[index].mimetype)">
                <img
                  :key="images[index].id"
                  :src="previewImage"
                  @click.stop="next"
                >
              </div>
              <iframe
                v-else-if="isAttachmentPdf(images[index].mimetype)"
                :src="`${images[index].location}`"
                type="application/pdf"
                class="pdf-preview"
              />
              <div v-else class="others-file">
                <legacy-icon
                  :name="fileIcon(images[index].mimetype)"
                  size="100"
                  viewbox="75"
                  class="file-icon"
                />
                <span class="download-file pointer" @click="open(images[index].path)">
                  <legacy-icon
                    name="download"
                    size="16px"
                    viewbox="16"
                  />
                  Download file
                </span>
              </div>
              <span class="next" :class="{'cursor-not-allowed': index === images.length - 1}" @click="next">
                <legacy-icon
                  name="right"
                  size="40px"
                  viewbox="40"
                  title="Next"
                  id="doc-share-button-svg"
                />
              </span>
          </div>

          <div class="title">
            <p v-if="images[index] && images[index].location !== undefined">
              {{ images[index].location | formatAttachmentName }}
            </p>
            <Popover :z-index="2001" :offset="10" :with-close="false" position="right-start" class="modal-action">
              <template #default="{ hide: topHide }">
                <div class="action-line">
                  <legacy-icon class="action-icon" name="download" viewbox="16" size="16px"></legacy-icon>
                  <div class="action-line-text" @click="open(images[index].location)">
                    Download
                  </div>
                </div>

                <template v-if="!archivedView">
                  <div class="action-separator"></div>

                  <Popover sub :z-index="2010" :offset="10" :with-close="false" position="right-end" class="delete-attachment left">
                    <template #default="{ hide }">
                      <div class="delete-confirmation">
                        <h3>Delete File</h3>

                        <p>File is about to be permanently deleted...</p>
                        <p>Warning: You can’t undo this action.</p>

                        <div class="delete-action">
                          <p @click="hide();">Cancel</p>
                          <button class="btn btn-primary" @click="handleMenu('delete', images[index]);hide();topHide();">
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
          <div class="images-count">
            {{ showImagesCount(index, images) }}
          </div>
        </div>
      </div>
  </Modal>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Model, Watch } from 'vue-property-decorator'
import { NewUploadResource } from '@/types/resource'

import Modal from '@/components/legacy/Modal.vue'
import Popover from '@/components/Popover.vue'

@Component({
  name: 'ImageViewer',
  components: {
    Modal,
    Popover
  },
  filters: {
    formatAttachmentName (location: string) {
      const splits = location.split('/')
      return splits[splits.length - 1]
    }
  }
})
export default class ImageViewer extends Vue {
  @Model('change', { type: Number }) readonly index!: number

  @Prop({ type: Array, default: [] })
  private readonly images!: Array<NewUploadResource>;

  @Prop({ type: Boolean })
  private readonly archivedView!: Boolean;

  @Watch('images')
  private resetIndex () {
    if (this.index >= this.images.length) {
      this.goto(this.prevImage, 'prev')
    }
    if (this.images.length === 0) {
      this.close()
    }
  }

  private slide = 'next'

  @Emit('close')
  close () {
    const oldIndex = this.index
    this.goto(null, 'none')
    this.$emit('close', oldIndex)
  }

  @Emit('remove')
  remove (attachment: NewUploadResource) {
    return attachment
  }

  async handleMenu (value: string, attachment: NewUploadResource) {
    switch (value) {
      case 'delete':
        this.remove(attachment)
        break
    }
  }

  open (src: string) {
    window.open(src, '_blank')
  }

  @Watch('visible')
  watchVisible (index: number) {
    if (index) {
      window.addEventListener('keyup', this.keyup)
    } else {
      window.removeEventListener('keyup', this.keyup)
    }
  }

  get visible () {
    return this.index !== null
  }

  get prevImage () {
    if (this.index > 0) {
      return this.index - 1
    }

    return this.index
  }

  get nextImage () {
    if (this.index < this.images.length - 1) {
      return this.index + 1
    }

    return this.index
  }

  get previewImage () {
    return this.images[this.index]?.versions?.preview?.location
  }

  isAttachmentImage (attachmentType: string) {
    return ['image/jpg', 'image/jpeg', 'image/png'].indexOf(attachmentType) !== -1
  }

  isAttachmentPdf (attachmentType: string) {
    return attachmentType === 'application/pdf'
  }

  prev () {
    this.$emit('prev', this.prevImage)
    this.goto(this.prevImage, 'prev')
  }

  next () {
    this.$emit('next', this.nextImage)
    this.goto(this.nextImage, 'next')
  }

  goto (idx: number | null, slide: string) {
    const idxGoto = idx !== null ? idx : -1
    this.slide = slide || (this.index < idxGoto ? 'next' : 'prev')
    this.$emit('change', idx)
  }

  keyup (e: any) {
    if (
      e.code === 'ArrowRight' ||
      e.key === 'ArrowRight' ||
      e.key === 'Right' ||
      e.keyCode === 39
    ) {
      this.next()
    } else if (
      e.code === 'ArrowLeft' ||
      e.key === 'ArrowLeft' ||
      e.key === 'Left' ||
      e.keyCode === 37
    ) {
      this.prev()
    } else if (
      e.code === 'Escape' ||
      e.key === 'Escape' ||
      e.key === 'Esc' ||
      e.keyCode === 27
    ) {
      this.close()
    }
  }

  showImagesCount (index: number, images: any) {
    const currentImage = index + 1
    const totalImages = images.length

    return `${currentImage} / ${totalImages}`
  }

  fileIcon (type: string) {
    switch (type) {
      case 'application/pdf':
        return 'filePdf'
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return 'fileDocx'
      default:
        return 'fileDefault'
    }
  }
}
</script>

<style lang="postcss" scoped>

  .task-modal-body {
    @apply relative;
  }

  .image {
    @apply rounded shadow shadow-lg;
    max-width: 80vw;
    max-height: 80vh;
  }

  .close {
    @apply fixed;

    top: 40px;
    right: 40px;

    svg {
      margin: 7px 0 0 8px;
    }
  }

  .image-container {
    .image-nav {
      @apply w-screen flex items-center;
      max-width: 100%;
      justify-content: center;

      .image-box {
        @apply mx-6 items-center flex;

        img {
          cursor: pointer;
          margin: 0 auto;
          border-radius: 4px;
          /* left: 50px; */
          /* position: absolute; */
          max-width: 800px;
          max-height: 600px;

          @media (min-width: 1200px) {
            max-width: 100vw;
            max-height: 75vh;
          }
        }

        .others-file {
          @apply flex items-center justify-center flex-col;

          border: 1px solid theme("colors.gray.400");
          box-sizing: border-box;
          border-radius: 4px;
          background-color: rgb(68 71 84);
          width: 800px;
          height: 600px;

          .file {
            color: #FFF;
            margin-bottom: 24px;
          }

          .download-file {
            @apply flex;

            color: #FFF;

            svg {
              margin-right: 8px;
            }
          }
        }
      }

      .pdf-preview {
        @apply w-full px-10;
        height: 800px;
        margin-top: -5rem;
      }
    }

    .title {
      @apply flex justify-center;

      text-align: center;
      color: #fff;
      margin-top: 8px;
      /* position: absolute; */
      word-break: break-word;
    }

    .images-count {
      text-align: center;
      color: rgb(255 255 255 / .7);
    }
  }

  .previous, .next, .close {
    background-color: rgb(255 255 255 / 20%);
    cursor: pointer;
    border-radius: 50px;
    color: #FFF;
    width: 48px;
    height: 48px;
    /* position: absolute; */

    &:hover {
      background-color: rgb(255 255 255 / 40%);
    }

    &.cursor-not-allowed {
      cursor: not-allowed !important;
    }
  }

  .previous {
    svg {
      margin: 8px 0 0 6px;
    }
  }

  .next {
    svg {
      margin: 8px 0 0 9px;
    }
  }

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

  .btn-link {
    padding: 0;
    width: 24px;
    height: 24px;
    background-color: rgb(255 255 255 / 20%);
    cursor: pointer;
    border-radius: 50px;
    margin-left: 8px;

    &:hover {
      background-color: rgb(255 255 255 / 40%);
    }
  }

  .popover-trigger.show button {
    background-color: rgb(255 255 255 / 40%);
    color: #FFF;
  }

  .modal-action {
    text-align: left;
  }

  .delete-confirmation {
    width: 272px;
    padding: 16px;
    border-radius: 4px;
    color: theme("colors.gray.900");
    text-align: left;

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

  .file-icon {
    margin: 32px 80px;
  }
</style>

<style lang="postcss">
/*******************/
/*   TRANSITIONS   */
/*******************/
.fade-enter,
.next-enter,
.prev-enter,
.fade-leave-active,
.prev-leave-active,
.next-leave-active {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active,
.prev-leave-active,
.next-leave-active {
  transition: opacity 300ms ease;
}
.prev-enter {
  transform: translateX(-40px);
}
.next-enter {
  transform: translateX(40px);
}
.next-enter-active,
.prev-enter-active {
  transition: opacity 300ms ease, transform 300ms ease;
}
</style>
