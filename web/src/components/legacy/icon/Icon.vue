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
import IconCheckmark2 from './IconCheckmark2.vue'
import IconDots from './IconDots.vue'
import IconDown from './IconDown.vue'
import IconDown2 from './IconDown2.vue'
import IconDownload from './IconDownload.vue'
import IconEdit from './IconEdit.vue'
import IconEmail from './IconEmail.vue'
import IconEmailSuccess from './IconEmailSuccess.vue'
import IconEmbed from './IconEmbed.vue'
import IconFile from './IconFile.vue'
import IconFileDocument from './IconFileDocument.vue'
import IconUpload from './IconUpload.vue'
import IconFilter from './IconFilter.vue'
import IconFilter2 from './IconFilter2.vue'
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
import IconTrash2 from './IconTrash2.vue'
import IconUnlock from './IconUnlock.vue'
import IconUp from './IconUp.vue'
import IconUser from './IconUser.vue'
import IconWarning from './IconWarning.vue'
import IconGoogle from './IconGoogle.vue'
import IconSpace from './IconSpace.vue'
import IconLoading from './IconLoading.vue'
import IconKanban from './IconKanban.vue'
import IconList from './IconList.vue'
import IconTag from './IconTag.vue'
import IconTime from './IconTime.vue'
import IconAttachment from './IconAttachment.vue'
import IconComment from './IconComment.vue'
import IconDrag from './IconDrag.vue'
import IconUser2 from './IconUser2.vue'
import IconEllipsis from './IconEllipsis.vue'
import IconPlus2 from './IconPlus2.vue'
import IconClose2 from './IconClose2.vue'
import IconReply from './IconReply.vue'
import IconContextMenu from './IconContextMenu.vue'
import IconShare from './IconShare.vue'
import IconHistory from './IconHistory.vue'
import IconShareGlobe from './IconShareGlobe.vue'
import IconColor from './IconColor.vue'
import IconArchive from './IconArchive.vue'
import IconRight2 from './IconRight2.vue'
import IconMessage from './IconMessage.vue'
import IconEdit2 from './IconEdit2.vue'
import IconGrid from './IconGrid.vue'
import IconLink2 from './IconLink2.vue'
import IconLayout from './IconLayout.vue'
import IconFolderOpen from './IconFolderOpen.vue'
import IconFolderClosed from './IconFolderClosed.vue'
import IconFileEmpty from './IconFileEmpty.vue'
import IconCode from './IconCode.vue'
import IconVerticalEllipsis from './IconVerticalEllipsis.vue'
import IconLogout from './IconLogout.vue'
import IconMenuDocument from './IconMenuDocument.vue'
import IconMenuEmbed from './IconMenuEmbed.vue'
import IconMenuFolder from './IconMenuFolder.vue'
import IconMenuLink from './IconMenuLink.vue'
import IconMenuTask from './IconMenuTask.vue'
import IconClose3 from './IconClose3.vue'
import IconPlus3 from './IconPlus3.vue'
import IconRestore from './IconRestore.vue'
import IconTrashArchive from './IconTrashArchive.vue'
import IconStrike from './IconStrike.vue'
import IconUndo from './IconUndo.vue'
import IconTable from './IconTable.vue'
import IconRedo from './IconRedo.vue'
import IconQuote from './IconQuote.vue'
import IconMedia from './IconMedia.vue'
import IconPen from './IconPen.vue'
import IconOrderedList from './IconOrderedList.vue'
import IconImageLeft from './IconImageLeft.vue'
import IconImageCenter from './IconImageCenter.vue'
import IconImageRight from './IconImageRight.vue'
import IconOpenLink from './IconOpenLink.vue'
import IconUnlink from './IconUnlink.vue'
import IconColumnRemove from './IconColumnRemove.vue'
import IconMerge from './IconMerge.vue'
import IconRowAdd from './IconRowAdd.vue'
import IconColumnAdd from './IconColumnAdd.vue'
import IconRowRemove from './IconRowRemove.vue'
import IconHighlight from './IconHighlight.vue'
import IconTextColor from './IconTextColor.vue'
import IconUnderline from './IconUnderline.vue'
import IconAlignRight from './IconAlignRight.vue'
import IconItalic from './IconItalic.vue'
import IconBold from './IconBold.vue'
import IconAlignLeft from './IconAlignLeft.vue'
import IconAlignCenter from './IconAlignCenter.vue'
import IconReferenceLink from './IconReferenceLink.vue'
import IconRemoveCircle from './IconRemoveCircle.vue'
import IconStar from './IconStar.vue'
import IconStriped from './IconStriped.vue'
import IconAddGreen from './IconAddGreen.vue'
import IconRemoveRed from './IconRemoveRed.vue'
import IconCheckmark3 from './IconCheckmark3.vue'

@Component({
  name: 'Icon',
  components: {
    IconAdd,
    IconCode,
    IconFileEmpty,
    IconFolderClosed,
    IconFolderOpen,
    IconLayout,
    IconLink2,
    IconArchive,
    IconAttachment,
    IconCheckmark,
    IconCheckmark2,
    IconComment,
    IconClose,
    IconClose2,
    IconClose3,
    IconColor,
    IconDots,
    IconDown,
    IconDown2,
    IconDownload,
    IconUpload,
    IconDrag,
    IconEdit,
    IconEdit2,
    IconEmail,
    IconEmailSuccess,
    IconEmbed,
    IconEllipsis,
    IconFile,
    IconFileDocument,
    IconFilter,
    IconFilter2,
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
    IconPlus3,
    IconRandom,
    IconRestore,
    IconReply,
    IconRight,
    IconRight2,
    IconSearch,
    IconStrike,
    IconSettings,
    IconTag,
    IconTime,
    IconTrash,
    IconTrash2,
    IconTrashArchive,
    IconUnlock,
    IconUp,
    IconUser,
    IconUser2,
    IconVerticalEllipsis,
    IconWarning,
    IconGoogle,
    IconSpace,
    IconLoading,
    IconContextMenu,
    IconShare,
    IconHistory,
    IconShareGlobe,
    IconGrid,
    IconLogout,
    IconMenuDocument,
    IconMenuEmbed,
    IconMenuFolder,
    IconMenuLink,
    IconMenuTask,
    IconMedia,
    IconOrderedList,
    IconPen,
    IconQuote,
    IconRedo,
    IconTable,
    IconUndo,
    IconImageLeft,
    IconImageCenter,
    IconImageRight,
    IconUnlink,
    IconOpenLink,
    IconRowAdd,
    IconRowRemove,
    IconColumnAdd,
    IconColumnRemove,
    IconMerge,
    IconHighlight,
    IconTextColor,
    IconBold,
    IconAlignLeft,
    IconAlignCenter,
    IconAlignRight,
    IconItalic,
    IconUnderline,
    IconReferenceLink,
    IconRemoveCircle,
    IconStar,
    IconStriped,
    IconAddGreen,
    IconRemoveRed,
    IconCheckmark3
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
