<template>
  <form-menu
    title="Task Board"
    description="Please select view type">
    <template>
      <form-task
        @submit="addTask"
        :space="activeSpace.id"
        ref="formTask"
      />
    </template>
  </form-menu>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

import FormMenu from '@/components/form/FormMenu.vue'
import FormTask from '@/components/form/FormTask.vue'

import {
  SpaceResource,
  TaskBoardResource
} from '@/types/resource'

@Component({
  name: 'TaskMenu',
  components: {
    FormMenu,
    FormTask
  }
})

export default class TaskMenu extends Vue {
  get activeSpace (): SpaceResource {
    return this.$store.getters['space/activeSpace']
  }

  addTask (data: TaskBoardResource) {
    this.$emit('submit-task', data)
  }
}
</script>
