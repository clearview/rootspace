<template>
  <div class="icon-libraries">
    <div v-for="(name, index) in icons" :key="index" class="item">
      <mono-icon v-if="type === 'mono'" :name="name" />
      <color-icon v-if="type === 'color'" :name="name" />
      <div class='name'>{{ name }}</div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import manifest from '../../../src/components/icon/manifest'
import { ColorIcon, MonoIcon } from '../../../src/components/icon'

@Component({
  name: 'icon-libraries',
  components: { ColorIcon, MonoIcon }
})
export default class IconLibraries extends Vue {
  @Prop({ type: String, default: '' })
  private readonly search!: string;

  @Prop({ type: String, default: 'mono' })
  private readonly type: 'mono'|'color'|undefined;

  get icons () {
    const icons = this.type === 'mono' ? manifest.mono : manifest.color
    const iconNames = Object.keys(icons).map((value) => {
      return value
        .replace(/Icon$/g, '')
        .split(/(?=[A-Z])/)
        .join('-')
        .toLowerCase()
    })
    return iconNames.filter(name => name.match(new RegExp(this.search)))
  }
}
</script>
<style lang="scss" scoped>
.icon-libraries {
  display: grid;
  grid-template-columns: auto auto auto auto auto;

  .item {
    text-align: center;
    padding: 20px;

    .icon {
      margin-bottom: 5px;
    }

    .name {
      font-size: 0.7rem;
    }
  }
}
</style>
