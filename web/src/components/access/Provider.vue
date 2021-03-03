<script lang="ts">
import { computed, defineComponent, provide, readonly, ref, watch } from '@vue/composition-api'
import SpaceService from '@/services/space'
import { SpaceResource } from '@/types/resource'
import { accessRoleKey } from './types'

export default defineComponent({
  name: 'AccessProvider',
  setup (_, { slots, root }) {
    const role = ref(1)
    const activeSpace = computed((): SpaceResource => (
      root.$store.getters['space/activeSpace']
    ))

    watch(
      () => activeSpace.value.id,
      async () => {
        if (activeSpace.value.id) {
          const data = await SpaceService.whoami(activeSpace.value.id)

          role.value = data.role
        }
      },
      { immediate: true }
    )

    provide(accessRoleKey, readonly(role))

    return () => slots.default && slots.default()
  }
})
</script>
