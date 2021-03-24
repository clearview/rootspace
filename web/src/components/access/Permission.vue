<script lang="ts">
import { computed, defineComponent, inject, PropType, ref } from '@vue/composition-api'
import { RawLocation } from 'vue-router'
import { AccessRole, accessRoleKey } from './types'

const roles: AccessRole[] = ['admin', 'member']

export default defineComponent({
  name: 'Permission',
  props: {
    role: {
      type: String
    },
    redirect: {
      type: [String, Object] as PropType<RawLocation>
    }
  },
  setup (props, { slots }) {
    const role = inject(accessRoleKey, ref(1))
    const allowedRole = computed(() => (
      roles.findIndex(x => x === props.role)
    ))

    const isAllowed = computed(() => role.value <= allowedRole.value)

    return () => {
      if (isAllowed.value && slots.default) {
        return slots.default()
      }

      return null
    }
  }
})
</script>
