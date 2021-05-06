<template>
  <form class="form" @submit.prevent="submit">
    <v-field label="Recieve email notification" name="spacename" inline>
      <button-switch v-model="payload.receiveEmail"/>
    </v-field>

    <div class="form-action">
      <button
        class="btn btn-primary"
        type="submit"
      >
        Save
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from '@vue/composition-api'
import UserPreferenceService from '@/services/userPreference'
import ButtonSwitch from '@/components/ButtonSwitch.vue'
import VField from '@/components/Field.vue'

export default defineComponent({
  components: {
    ButtonSwitch,
    VField
  },
  setup (_, ctx) {
    const activeSpace = computed(() => ctx.root.$store.getters['space/activeSpace'] || {})
    const payload = ref({
      receiveEmail: true
    })

    const submit = async () => {
      await UserPreferenceService.update({
        spaceId: activeSpace.value.id,
        data: { ...payload.value }
      })
    }

    onMounted(async () => {
      const preference = await UserPreferenceService.fetch(activeSpace.value.id)

      if (preference.receiveEmail !== undefined) {
        payload.value = {
          ...payload.value,
          receiveEmail: preference.receiveEmail
        }
      }
    })

    return {
      payload,
      submit
    }
  }
})
</script>

<style lang="postcss" scoped>
.form >>> .control {
  justify-content: flex-end;
}

.form-action {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
