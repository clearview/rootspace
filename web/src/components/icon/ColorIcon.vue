<template>
  <div class="icon icon--color" :title="iconName">
    <component
      :is="iconName"
      width='1em'
      height='1em'
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { kebabCase } from 'lodash'
import manifest from './manifest'

export default defineComponent({
  name: 'ColorIcon',
  components: manifest.color,
  props: {
    name: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const iconName = computed(() => {
      return kebabCase(`${props.name}-icon`)
    })

    return {
      iconName
    }
  }
})
</script>
