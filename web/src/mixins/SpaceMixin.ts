import { Vue, Component } from 'vue-property-decorator'
import { SpaceResource, SpaceMetaResource } from '@/types/resource'

@Component
export default class SpaceMixin extends Vue {
  get activeSpace (): SpaceResource {
    return this.$store.getters['space/activeSpace'] || {}
  }

  get activeSpaceMeta (): SpaceMetaResource {
    return this.$store.getters['space/activeSpaceMeta'] || {}
  }

  get hasSpace (): boolean {
    return this.$store.getters['space/hasSpace']
  }

  setActiveSpace (id: number, meta?: SpaceMetaResource) {
    const space = { id }

    if (this.activeSpace.id !== space.id) {
      this.$store.commit('space/setActive', { space })
    }

    if (meta) {
      const index = this.$store.state.space.activeIndex

      this.$store.commit('space/updateMeta', { index, meta })
    }
  }
}
