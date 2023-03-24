<template>
  <div v-if="ready">
    <Alert v-model="alertData" />
    <div class="field">
      <button-switch v-model="payload.receiveEmail" @input="submit" />
      <div class="label">Recieve email notifications</div>
    </div>
  </div>
  <div v-else>
    Loading...
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from '@vue/composition-api'
import UserPreferenceService from '@/services/userPreference'
import Alert from '@/components/Alert.vue'
import ButtonSwitch from '@/components/ButtonSwitch.vue'

interface AlertData {
  type: 'success' | 'danger'
  message: string
}

export default defineComponent({
  components: {
    Alert,
    ButtonSwitch
  },
  setup (_, ctx) {
    const activeSpace = computed(() => ctx.root.$store.getters['space/activeSpace'] || {})
    const ready = ref(false)
    const alertData = ref<AlertData>()
    const payload = ref({
      receiveEmail: true
    })

    const submit = async () => {
      try {
        await UserPreferenceService.update({
          spaceId: activeSpace.value.id,
          data: { ...payload.value }
        })

        alertData.value = {
          type: 'success',
          message: 'Your setting has been saved'
        }
      } catch (e) {
        alertData.value = {
          type: 'danger',
          message: e.message
        }
      }
    }

    const fetch = async () => {
      const preference = await UserPreferenceService.fetch(activeSpace.value.id)

      ready.value = true

      if (preference && preference.receiveEmail !== undefined) {
        payload.value = {
          ...payload.value,
          receiveEmail: preference.receiveEmail
        }
      }
    }

    watch(
      () => ctx.root.$store.state.space.activeIndex,
      () => fetch()
    )

    onMounted(() => fetch())

    return {
      alertData,
      ready,
      payload,
      submit
    }
  }
})
</script>

<style lang="postcss" scoped>
>>> .alert {
  margin-bottom: 2em;
}

.field {
  display: flex;
  flex-flow: row;
  align-items: center;

  .label {
    margin-left: 1em;
  }
}
</style>
