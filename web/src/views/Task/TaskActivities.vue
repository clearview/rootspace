<template>
  <div class="task-activities">
    <TaskActivity></TaskActivity>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import TaskActivity from './TaskActivity.vue'
@Component({
  components: { TaskActivity }
})
export default class TaskActivities extends Vue {
};
</script>

<style scoped>

</style>
