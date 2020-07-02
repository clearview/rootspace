<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  name: 'Link'
})
export default class Link extends Vue {
  get link () {
    return this.$store.state.link.item
  }

  redirect () {
    window.open(this.link.value, '_blank')

    this.$router.replace('/')
  }

  async created () {
    const id = this.$route.params.id

    await this.$store.dispatch('link/view', id)

    this.redirect()
  }

  render () {
    return null
  }
}
</script>
