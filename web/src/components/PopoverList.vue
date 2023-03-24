<template>
  <Popover :with-close="false" position="bottom-start">
    <template v-slot:default="slotApi">
      <ul class="list">
        <li class="item" v-for="item in items" :key="item.value" @click="input(item.value, slotApi)">
          <div class="icon">
            <legacy-icon v-if="item.icon " :name="item.icon"/>
          </div>
          <div class="label">
            {{item.label}}
          </div>
        </li>
      </ul>
    </template>
    <template v-slot:trigger>
      <slot name="trigger"></slot>
    </template>
  </Popover>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'
import Popover from '@/components/Popover.vue'

@Component({
  name: 'PopoverList',
  components: { Popover }
})
export default class PopoverList extends Vue {
    @Prop({ type: Array, required: true })
    private readonly items!: { label: string; value: string; icon: string }[]

    @Emit('input')
    input (value: string, slotApi: any) {
      if (slotApi.hide) {
        slotApi.hide()
      }
      return value
    }
}
</script>

<style lang="postcss" scoped>

  .list {
    @apply py-1;
  }

  .item {
    @apply py-2 px-6 flex items-center;
    transition: all 0.3s ease;
    cursor: pointer;
    color: theme("colors.gray.800");
    font-weight: 600;

    &:hover {
      background: theme("colors.gray.100");
    }
  }
  .icon {
    flex: 0 0 auto;
    width: 24px;
  }
  .label {
    flex: 1 1 auto;
    @apply pr-2;
  }

</style>
