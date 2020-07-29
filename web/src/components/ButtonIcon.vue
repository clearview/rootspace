<template>
  <button
    class="btn btn-icon"
    :class="{
      'btn-mute': mute,
      'btn-active': active,
      'bg-transparent': transparent
    }"
    v-on="$listeners"
  >
    <v-icon
      class="icon"
      :name="name"
      :size="size"
      :viewbox="viewbox"
    />
  </button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  name: 'ButtonIcon'
})
export default class ButtonIcon extends Vue {
  @Prop(String)
  private readonly name!: string

  @Prop(String)
  private readonly size!: string

  @Prop([String, Number])
  private readonly viewbox!: string | number

  @Prop(Boolean)
  private readonly mute!: boolean

  @Prop(Boolean)
  private readonly active!: boolean

  @Prop(Boolean)
  private readonly transparent!: boolean
}
</script>

<style lang="postcss" scoped>
.btn-active {
  .icon {
    @apply text-primary;
  }
}
</style>
