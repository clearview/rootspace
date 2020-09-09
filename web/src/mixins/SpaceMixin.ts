import { Vue, Component } from 'vue-property-decorator'
import { SpaceResource, SpaceSettingResource } from '@/types/resource'

@Component
export default class SpaceMixin extends Vue {
  get spaces (): SpaceResource[] {
    return this.$store.state.space.list
  }

  get activeSpace (): SpaceResource {
    return this.$store.getters['space/activeSpace']
  }

  get activeSpaceSetting (): SpaceSettingResource {
    return this.$store.getters['space/activeSetting']
  }

  get hasSpace (): boolean {
    return this.$store.getters['space/isListEmpty'] === false
  }

  activateSpace (id: number) {
    this.$store.dispatch('space/activate', id)
  }

  async updateSpaceSetting (id: number, data: Partial<SpaceSettingResource>) {
    await this.$store.dispatch('space/updateSetting', { id, data })
  }

  getSpaceSettingById (id: number) {
    return this.$store.getters['space/getSettingById'](id)
  }
}
