import { Vue, Component } from 'vue-property-decorator'

@Component
export default class PageMixin extends Vue {
  setPageTitle (title: string) {
    const space = this.$store.getters['space/activeSpace'] || {}

    document.title = `${title} · ${space.title} · Root`
  }
}
