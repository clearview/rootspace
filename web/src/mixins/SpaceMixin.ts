import { Vue, Component } from 'vue-property-decorator'
import { SpaceResource } from '@/types/resource'

@Component
export default class SpaceMixin extends Vue {
  get spaces (): SpaceResource[] {
    return this.$store.state.space.list
  }

  get activeSpace (): SpaceResource {
    return this.$store.getters['space/activeSpace']
  }

  get activeSpacePage (): string {
    return this.$store.getters['space/activePage'] || '/'
  }

  get hasSpace (): boolean {
    return this.$store.getters['space/isListEmpty'] === false
  }

  activateSpace (id: number) {
    this.$store.dispatch('space/activateSpace', id)
  }

  updateSpaceActivePage (id: number, path: string) {
    this.$store.dispatch('space/updateActivePage', { id, path })
  }
}
