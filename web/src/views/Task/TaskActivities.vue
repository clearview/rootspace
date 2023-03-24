<template>
  <div class="task-activities">
    <TaskActivity v-for="act in limitedActivities" :activity="act" :key="act.id"></TaskActivity>
    <div class="view-more" v-if="hasMore">
      <div class="view-more-content" @click="addLimit">
      <legacy-icon class="more-icon" name="down" viewbox="32" size="20px"></legacy-icon>
      <span class="more-label">
        View More
      </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import TaskActivity from './TaskActivity.vue'
import { TaskActivityResource, TaskItemResource } from '@/types/resource'
import api from '@/utils/api'
@Component({
  components: { TaskActivity }
})
export default class TaskActivities extends Vue {
  @Prop({ type: Object, required: true })
  private readonly item!: TaskItemResource;

  private limit = 3
  private get limitedActivities () {
    if (this.limit === -1) {
      return this.activities
    }
    return this.activities.slice(0, this.limit)
  }

  private get hasMore () {
    return this.activities.length > this.limit && this.limit !== -1
  }

  private activities: TaskActivityResource[] = [];

  addLimit () {
    this.limit += 10
  }

  @Watch('item')
  async onItemChanged () {
    await this.fetchActivities()
  }

  async mounted () {
    await this.fetchActivities()
  }

  async fetchActivities () {
    const res = await api.get(`activities/entity/task/${this.item.id}`)
    this.activities = res.data.data
  }
}
</script>

<style lang="postcss" scoped>
.view-more {
  display: flex;
  align-items: center;
  justify-content: center;
}
.view-more-content{
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 14px;
  color: #AAB1C5;
  cursor: pointer;
  padding: 8px 8px 0;
  &:hover {
    color: theme("colors.primary.default");
  }
  .more-label {
    margin-left: 8px;
  }
}
</style>
