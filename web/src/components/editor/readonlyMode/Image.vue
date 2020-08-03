<template>
  <div class="cdx-block image-tool"
    :class="{
      'image-tool--empty': Object.keys(value.data.file).length === 0,
      'image-tool--filled': Object.keys(value.data.file).length > 0,
      'image-tool--withBorder': value.data.withBorder,
      'image-tool--withBackground': value.data.withBackground,
      'ce-block--stretched': value.data.stretched
    }"
  >
    <div class="image-tool__image"
      :class="{
        'image-tool--stretched': value.data.stretched
      }"
    >
      <div class="image-tool__image-preloader"></div>
      <img class="image-tool__image-picture" v-if="Object.keys(value.data.file).length > 0" :src="value.data.file.url">
    </div>
    <div class="cdx-input image-tool__caption">
      {{ value.data.caption }}
    </div>
    <div class="cdx-button">
      <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.15 13.628A7.749 7.749 0 0 0 10 17.75a7.74 7.74 0 0 0 6.305-3.242l-2.387-2.127-2.765 2.244-4.389-4.496-3.614 3.5zm-.787-2.303l4.446-4.371 4.52 4.63 2.534-2.057 3.533 2.797c.23-.734.354-1.514.354-2.324a7.75 7.75 0 1 0-15.387 1.325zM10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10z"></path>
      </svg>
      Select an Image
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'ReadOnlyImage'
})

export default class ReadOnlyImage extends Vue {
  @Prop({ type: Object })
  private readonly value!: object;
}
</script>

<style lang="postcss">
.cdx-input {
    border: 1px solid rgba(201,201,204,.48);
    -webkit-box-shadow: inset 0 1px 2px 0 rgba(35,44,72,.06);
    box-shadow: inset 0 1px 2px 0 rgba(35,44,72,.06);
    border-radius: 3px;
    padding: 10px 12px;
    outline: none;
    width: 100%;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
</style>
