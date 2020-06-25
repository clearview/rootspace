<template>
  <Popover top="48px">
    <template>
      <div class="due-field">
        <label class="field-label">
          Time
        </label>
        <div class="time-input">
          <select class="time-select" v-model="hour">
            <option v-for="hour in hours" :key="hour" :value="hour">
              {{hour | padLeftZero}}
            </option>
          </select>
          <select class="time-select" v-model="minute">
            <option v-for="minute in minutes" :key="minute" :value="minute">
              {{minute | padLeftZero}}
            </option>
          </select>
        </div>
      </div>
      <div class="due-field">
        <label class="field-label">
          Date
        </label>
        <DatePicker v-model="date" @input="input" is-inline color="red"/>
      </div>
      <div class="due-field">
        <button class="btn btn-primary" @click="clear">Clear</button>
      </div>
    </template>
    <template v-slot:trigger>
      <slot name="trigger"></slot>
    </template>
  </Popover>
</template>

<script lang="ts">
import { Component, Emit, Vue, Watch } from 'vue-property-decorator'
import Popover from '@/components/Popover.vue'
import { DatePicker } from 'v-calendar'
import { mapState } from 'vuex'

  @Component({
    name: 'DueDatePopover',
    components: { Popover, DatePicker },
    computed: {
      ...mapState('task/tag', {
        tags: 'data'
      })
    },
    filters: {
      padLeftZero (value: string) {
        return String(value).padStart(2, '0')
      }
    }
  })
export default class DueDatePopover extends Vue {
    private date = new Date()
    private hour = 0
    private minute = 0

    @Watch('hour')
    @Watch('minute')
    updateDate () {
      this.date.setHours(this.hour, this.minute, 0, 0)
      this.input()
    }

    @Emit('input')
    input () {
      return this.date
    }

    @Emit('clear')
    clear () {

    }

    private numGenerator (from: number, to: number) {
      const cache: Record<string, number[]> = {}
      return () => {
        if (cache[`${from}_${to}`]) {
          return cache[`${from}_${to}`]
        }
        const numbers = []
        for (let i = from; i <= to; i++) {
          numbers.push(i)
        }
        cache[`${from}_${to}`] = numbers
        return numbers
      }
    }

    get hours () {
      return this.numGenerator(0, 23)()
    }

    get minutes () {
      return this.numGenerator(0, 59)()
    }
}
</script>

<style lang="postcss" scoped>

  .due-field {
    @apply px-2;
    &:first-child{
      @apply mt-2;
    }
    &:last-child{
      @apply mb-2;
    }
  }

  .field-label{
    @apply mb-2 text-base;
    font-weight: bold;
    color: theme("colors.gray.900")
  }
  .time-input {
    @apply flex items-center rounded;
    border: solid 2px theme("colors.gray.100");
  }
  .time-select {
    @apply p-2;
    flex: 1 1 auto;
    & ~ & {
      @apply ml-2;
    }
  }

</style>
