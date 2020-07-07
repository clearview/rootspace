<template>
  <ul class="cdx-block cdx-list" :class="listType(value.data.style)">
    <li class="cdx-list__item" v-for="(list, index) in value.data.items" :key="index" v-html="list"></li>
  </ul>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'ReadOnlyList'
})

export default class ReadOnlyList extends Vue {
  @Prop({ type: Object })
  private readonly value!: object;

  listType (style: string) {
    return style === 'unordered' ? 'cdx-list--unordered' : 'cdx-list--ordered'
  }
}
</script>
