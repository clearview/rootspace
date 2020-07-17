<template>
  <Popover top="48px">
    <template #default="slotApi">
      <div class="field">
        <label class="field-label">
          Due Date
        </label>
        <DatePicker v-model="date" @input="input" is-inline color="red"/>
      </div>
      <div class="bottom-field">
        <div class="field">
          <label class="field-label">
            Date
          </label>
          <div class="date-input">
            {{ date | formatDateDisplay }}
          </div>
        </div>
        <div class="field">
          <label class="field-label">
            Time
          </label>
          <div class="time-input">
            <select class="time-select" v-model="hour">
              <option v-for="hour in hours" :key="hour" :value="hour">
                {{hour | padLeftZero}}
              </option>
            </select>
            <div class="time-sep">:</div>
            <select class="time-select" v-model="minute">
              <option v-for="minute in minutes" :key="minute" :value="minute">
                {{minute | padLeftZero}}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="actions">
        <button class="btn btn-link" @click="clear">Clear</button>
        <button class="btn btn-link-primary" @click="save(slotApi)">Save</button>
      </div>
    </template>
    <template v-slot:trigger>
      <slot name="trigger"></slot>
    </template>
  </Popover>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator'
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
    },
    formatDateDisplay (date: Date) {
      return `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`
    }
  }
})
export default class DueDatePopover extends Vue {
    @Prop(Date)
    private readonly initialDate?: Date;

    private date = this.initialDate ? this.initialDate : new Date()
    private hour = this.initialDate ? this.initialDate.getHours() : 0
    private minute = this.initialDate ? this.initialDate.getMinutes() : 0

    @Watch('hour')
    @Watch('minute')
    updateDate () {
      this.date.setHours(this.hour, this.minute, 0, 0)
      this.input()
    }

    input () {
      this.date.setHours(this.hour, this.minute, 0, 0)
      return this.date
    }

    @Emit('input')
    save (slotApi: any) {
      slotApi.hide()
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

  .field {
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
    background: transparent;
    & ~ & {
      @apply ml-2;
    }
  }

  .date-input{
    @apply flex items-center rounded w-full;
    border: solid 2px theme("colors.gray.100");
    flex: 1 1 auto;
    padding:6px;
  }

  .bottom-field {
    @apply flex items-start mb-2;
    .field {
      @apply mt-2 mb-0;
      flex: 1 1 50%;
    }
  }

  .actions {
    @apply flex items-center justify-end mb-2 mr-2;
    .btn {
      @apply px-4 py-2;
    }
  }

</style>
