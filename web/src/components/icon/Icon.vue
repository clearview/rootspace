<template>
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    :width="_widthSize"
    :height="_heightSize"
    :viewBox="_viewbox"
    class="fill-current stroke-current"
  >
    <title v-if="withTitle">{{ titleIcon }}</title>
    <component v-if="isIconValid" :is="`icon-${name}`" />
  </svg>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

import IconAdd from './IconAdd.vue'
import IconClose from './IconClose.vue'
import IconCheckmark from './IconCheckmark.vue'
import IconDots from './IconDots.vue'
import IconDown from './IconDown.vue'
import IconDownload from './IconDownload.vue'
import IconEdit from './IconEdit.vue'
import IconEmail from './IconEmail.vue'
import IconEmbed from './IconEmbed.vue'
import IconFile from './IconFile.vue'
import IconFileDocument from './IconFileDocument.vue'
import IconUpload from './IconUpload.vue'
import IconFilter from './IconFilter.vue'
import IconFolder from './IconFolder.vue'
import IconLeft from './IconLeft.vue'
import IconLink from './IconLink.vue'
import IconLinkEdit from './IconLinkEdit.vue'
import IconLock from './IconLock.vue'
import IconPlus from './IconPlus.vue'
import IconRandom from './IconRandom.vue'
import IconRight from './IconRight.vue'
import IconSearch from './IconSearch.vue'
import IconSettings from './IconSettings.vue'
import IconTrash from './IconTrash.vue'
import IconUnlock from './IconUnlock.vue'
import IconUp from './IconUp.vue'
import IconUser from './IconUser.vue'
import IconWarning from './IconWarning.vue'
import IconGoogle from './IconGoogle.vue'
import IconSpace from './IconSpace.vue'
import IconLoading from './IconLoading.vue'
import IconKanban from '@/components/icon/IconKanban.vue'
import IconList from '@/components/icon/IconList.vue'
import IconTag from '@/components/icon/IconTag.vue'
import IconTime from '@/components/icon/IconTime.vue'
import IconAttachment from '@/components/icon/IconAttachment.vue'
import IconComment from '@/components/icon/IconComment.vue'
import IconDrag from '@/components/icon/IconDrag.vue'
import IconUser2 from '@/components/icon/IconUser2.vue'
import IconEllipsis from '@/components/icon/IconEllipsis.vue'
import IconPlus2 from '@/components/icon/IconPlus2.vue'
import IconClose2 from '@/components/icon/IconClose2.vue'
import IconReply from '@/components/icon/IconReply.vue'
import IconContextMenu from './IconContextMenu.vue'
import IconShare from './IconShare.vue'
import IconHistory from './IconHistory.vue'
import IconShareGlobe from './IconShareGlobe.vue'
import IconColor from '@/components/icon/IconColor.vue'
import IconArchive from '@/components/icon/IconArchive.vue'
import IconRight2 from '@/components/icon/IconRight2.vue'
import IconMessage from '@/components/icon/IconMessage.vue'

@Component({
  name: 'Icon',
  components: {
    IconAdd,
    IconArchive,
    IconAttachment,
    IconCheckmark,
    IconComment,
    IconClose,
    IconClose2,
    IconColor,
    IconDots,
    IconDown,
    IconDownload,
    IconUpload,
    IconDrag,
    IconEdit,
    IconEmail,
    IconEmbed,
    IconEllipsis,
    IconFile,
    IconFileDocument,
    IconFilter,
    IconKanban,
    IconFolder,
    IconLeft,
    IconLink,
    IconList,
    IconLinkEdit,
    IconLock,
    IconMessage,
    IconPlus,
    IconPlus2,
    IconRandom,
    IconReply,
    IconRight,
    IconRight2,
    IconSearch,
    IconSettings,
    IconTag,
    IconTime,
    IconTrash,
    IconUnlock,
    IconUp,
    IconUser,
    IconUser2,
    IconWarning,
    IconGoogle,
    IconSpace,
    IconLoading,
    IconContextMenu,
    IconShare,
    IconHistory,
    IconShareGlobe
  }
})
export default class Icon extends Vue {
  @Prop({ type: String, required: true })
  private readonly name!: string;

  @Prop({ type: [String, Number], default: '1em' })
  private readonly size!: string | number;

  @Prop({ type: [String, Number], default: 32 })
  private readonly viewbox!: string | number;

  @Prop({ type: Boolean, default: true })
  private readonly withTitle?: boolean

  @Prop({ type: String })
  private readonly title?: string;

  get _viewbox () {
    const viewBoxWH = this.viewbox.toString().split(' ')
    return viewBoxWH.length > 1 ? `0 0 ${viewBoxWH[0]} ${viewBoxWH[1]}` : `0 0 ${this.viewbox} ${this.viewbox}`
  }

  get _widthSize () {
    const sizeWH = this.size.toString().split(' ')
    return sizeWH.length > 1 ? sizeWH[0] : this.size
  }

  get _heightSize () {
    const sizeWH = this.size.toString().split(' ')
    return sizeWH.length > 1 ? sizeWH[1] : this.size
  }

  get isIconValid () {
    const comps = this.$options.components as Record<string, any>
    const icons = Object.keys(comps)
    const cleanName = 'icon' + this.name.replace('-', '').toLowerCase()
    return icons.findIndex(key => cleanName === key.toLowerCase()) !== -1
  }

  get titleIcon () {
    return this.title ? this.title : this.name
  }
}
</script>
