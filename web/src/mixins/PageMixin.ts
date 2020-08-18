import { Vue, Component } from 'vue-property-decorator'

const appTitle = 'Root'

@Component
export default class PageMixin extends Vue {
  setPageTitle (title?: string) {
    const { title: spaceTitle } = this.$store.getters['space/activeSpace'] || {}
    const titleFragments = [title, spaceTitle, appTitle]

    document.title = titleFragments.filter(x => x).join(' · ')
  }
}
