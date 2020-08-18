import { Vue, Component } from 'vue-property-decorator'

@Component
export default class PageMixin extends Vue {
  get pageTitle () {
    return document.title
  }

  set pageTitle (title: string | null) {
    const { title: spaceTitle } = this.$store.getters['space/activeSpace'] || {}

    const appName = 'Root'
    const fragments = [title, spaceTitle, appName]

    document.title = fragments.filter(x => x).join(' · ')
  }
}
