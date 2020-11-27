<template>
  <g>
    <rect x="1.5" y="1.5" width="13" height="13" rx="1.5" stroke="currentStroke"/>
    <rect x="6" y="2" width="4" height="12" fill="#DEE2EE"/>
    <line x1="5.5" y1="1" x2="5.5" y2="15" stroke="currentStroke"/>
    <path d="M10 1L10 15" stroke="currentStroke"/>
    <ellipse cx="14.5" cy="8" rx="3.5" ry="4" fill="white"/>
    <path d="M12.75 8H16.25" stroke="currentStroke" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'IconColumnRemove'
})
</script>
