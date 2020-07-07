<template>
  <div class="tc-editor cdx-block">
    <div class="tc-table__wrap">
      <table class="tc-table">
        <tbody>
          <tr v-for="(content, index) in value.data.content" :key="index">
            <td class="tc-table__cell" v-for="(contentTd, indexTd) in content" :key="indexTd">
              <div class="tc-table__area">
                <div class="tc-table__inp" v-html="contentTd"></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'ReadOnlyTable'
})

export default class ReadOnlyTable extends Vue {
  @Prop({ type: Object })
  private readonly value!: object;
}
</script>
