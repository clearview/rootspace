<template>
  <g>
    <rect x="1.5" y="1.5" width="13" height="13" rx="1.5" stroke="currentStroke"/>
    <rect x="14" y="6" width="5" height="12" transform="rotate(90 14 6)" fill="#DEE2EE"/>
    <line y1="-0.5" x2="14" y2="-0.5" transform="matrix(-1 -8.74226e-08 -8.74226e-08 1 15 6)" stroke="currentStroke"/>
    <path d="M15 11L1 11" stroke="currentStroke"/>
    <ellipse cx="14.5" cy="8" rx="3.5" ry="4" fill="white"/>
    <path d="M12.75 8H16.25" stroke="currentStroke" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'IconRowRemove'
})
</script>
