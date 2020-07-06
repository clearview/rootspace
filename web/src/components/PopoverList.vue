<template>
  <Popover>
    <template v-slot:default="slotApi">
      <ul class="list">
        <li class="item" v-for="item in items" :key="item.value" @click="input(item.value, slotApi)">{{item.label}}</li>
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
    private readonly items!: { label: string; value: string }[]

    @Emit('input')
    input (value: string, slotApi: any) { // eslint-disable-line
      if (slotApi.hide) {
        slotApi.hide()
      }
      return value
    }
}
</script>

<style lang="postcss" scoped>

  .list {
    @apply py-2;
  }

  .item {
    @apply py-2 px-6;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      background: theme("colors.gray.100");
    }
  }

</style>
