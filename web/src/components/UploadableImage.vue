<template>
  <div class="uploadable-image" :style="{width, height, borderRadius: radius}" @click="pickFile">
    <input type="file" ref="file" class="file" @change="processFile" accept=".jpg,.png,.jpeg,.gif,image/jpg,image/jpeg,image/png,image/gif">
    <img v-if="uploadCopy && !isUploadingImage" :src="uploadCopy.versions.default.path" alt="" class="img" :style="{width, height, borderRadius: radius}">
    <img v-if="isUploadingImage" :src="fakeImage" alt="" class="img img-fake" :style="{width, height, borderRadius: radius}">
    <slot name="fallback" v-if="!uploadCopy && !isUploadingImage">
    </slot>
    <div class="edit" v-if="!isUploadingImage" :style="{top: editOffset, right: editOffset}">
      <v-icon name="edit2" size="18px" viewbox="18"></v-icon>
    </div>
    <v-icon class="loading" name="loading" size="3em" viewbox="100" v-if="isUploadingImage"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator'
import { NewUploadResource } from '@/types/resource'
import api from '@/utils/api'
import store from '@/store'

@Component({
  name: 'UploadableImage',
  components: {}
})
export default class UploadableImage extends Vue {
  @Prop({ type: [Number, String], default: '100px' })
  private readonly width!: number | string;

  @Prop({
    type: String,
    required: true,
    validator (value: any): boolean {
      return ['userAvatar', 'spaceLogo'].indexOf(value) !== -1
    }
  })
  private readonly type!: 'userAvatar' | 'spaceLogo'

  @Prop({ type: [Number, String], default: '100px' })
  private readonly height!: number | string;

  @Prop({ type: [Number, String], default: '0' })
  private readonly radius!: number | string;

  @Prop({ type: [Number, String], default: '-12px' })
  private readonly editOffset!: number | string;

  @Prop(Object)
  private readonly extra?: Record<string, any>;

  @Prop(Object)
  private readonly upload?: NewUploadResource;

  private uploadCopy = this.upload;
  @Watch('upload')
  private recopy () {
    this.uploadCopy = this.upload
  }

  @Ref('file')
  private readonly fileRef!: HTMLInputElement;

  private isUploadingImage = false;
  private fakeImage = '';

  pickFile () {
    if (!this.isUploadingImage) {
      this.fileRef.click()
    }
  }

  async processFile () {
    const files = this.fileRef.files
    const file = files?.item(0)
    const acceptable = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
    if (file && acceptable.indexOf(file.type) !== -1) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', this.type)
      if (this.extra) {
        for (const key of Object.keys(this.extra)) {
          formData.append(key, this.extra[key])
        }
      }
      this.isUploadingImage = true
      const reader = new FileReader()
      reader.addEventListener('loadend', () => {
        this.fakeImage = reader.result as string
      })
      reader.readAsDataURL(file)
      const res = await api.post('uploads', formData)
      this.uploadCopy = res.data.data
      await store.dispatch('auth/whoami', { updateSpace: true })
      this.isUploadingImage = false
      this.fakeImage = ''
    }
  }
}
</script>

<style lang="postcss" scoped>
  .uploadable-image {
    background: transparent;
    color: #fff;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    img, .img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .img-fake{
      filter: blur(2px);
      object-fit: cover;
    }
    &:hover {
      .edit {
        display: block;
      }
    }
  }
  .edit {
    display: none;
    position: absolute;
    background: theme("colors.gray.100");
    border-radius: 100px;
    padding: 5px;
    .stroke-current {
      stroke: #444754;
    }
    .fill-current {
      fill: none;
    }
  }
  .loading {
    position: absolute;

  }
  .file {
    display: none;
  }
</style>
