<template>
  <span class="reference-view">
    <router-link v-if="linkable" :to="to">
      <span class="icon">
        <legacy-icon viewbox="16" :name="getIcon(type)"/>
      </span>
      <span class="label">
        {{ label }}
      </span>
    </router-link>
    <template v-else>
      <span class="icon">
        <legacy-icon viewbox="16" :name="getIcon(type)"/>
      </span>
      <span class="label">
        {{ label }}
      </span>
    </template>
  </span>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Dictionary, Location } from 'vue-router/types/router'

const nodeIconNames: Record<string, string> = {
  link: 'link2',
  doc: 'file-empty',
  taskBoard: 'layout',
  embed: 'code',
  folder: 'folder-closed',
  archive: 'folder-closed'
}
const nodeRouteNames: Record<string, string> = {
  link: 'Link',
  doc: 'Document',
  novaDoc: 'Novadoc',
  taskBoard: 'TaskPage',
  embed: 'Embed',
  folder: ''
}

@Component
export default class ReferenceView extends Vue {
  @Prop({ type: String, required: true })
  private readonly type!: string;

  @Prop({ type: [String, Number], required: true })
  private readonly id!: string | number;

  @Prop({ type: [String, Number], required: true })
  private readonly contentId!: string | number;

  @Prop({ type: String, required: true })
  private readonly label!: string;

  @Prop({ type: Boolean, required: false })
  private readonly novadoc!: boolean;

  getIcon (type: string) {
    return nodeIconNames[type]
  }

  get linkable () {
    return this.type !== 'folder'
  }

  get to (): Location {
    let name = nodeRouteNames[this.type] as string
    if (this.novadoc) {
      name = 'Novadoc'
    }
    const params: Dictionary<string> = {}

    if (this.contentId) {
      params.id = this.contentId.toString()
    }

    return { name, params }
  }
}
</script>

<style lang="postcss" scoped>
.reference-view {
  display: inline-block;
  padding: 0 2px;
  border-radius: 4px;
  a {
    text-decoration: none;
  }
  .icon {
    display: inline-block;
    position: relative;
    top: 2px;
    color: #146493;
    .stroke-current, .fill-current {
      fill: transparent;
    }
  }
  .label {
    color: #146493;
  }
  &.ProseMirror-selectednode{
    background: #146493;
    .icon, .label {
      color: #fff;
    }
  }
}
</style>
