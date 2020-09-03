import { Vue, Component } from 'vue-property-decorator'
import { SpaceResource, SpaceMetaResource } from '@/types/resource'

@Component
export default class SpaceMixin extends Vue {
  get spaces (): SpaceResource[] {
    return this.$store.state.space.spaces || []
  }

  get activeSpace (): SpaceResource {
    return this.$store.getters['space/activeSpace'] || {}
  }

  get activeSpaceMeta (): SpaceMetaResource {
    return this.$store.getters['space/activeSpaceMeta'] || {}
  }

  get hasSpace (): boolean {
    return this.$store.getters['space/hasSpace']
  }

  switchActiveSpace (id?: number) {
    if (id && id !== this.activeSpace.id) {
      this.$store.commit('space/setActive', {
        space: { id }
      })
    }

    this.$store.commit('space/updateMeta', {
      index: this.$store.state.space.activeIndex,
      meta: {
        activePage: this.$route.path
      }
    })
  }
}
