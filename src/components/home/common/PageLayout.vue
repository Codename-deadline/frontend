<script setup lang="ts">
import GlobalFooter from "./GlobalFooter.vue";
import GlobalHeader from "./GlobalHeader.vue";
</script>

<template>
  <global-header class="mt"/>
  <div class="mt-8 px-8">
    <slot name="header"/>
    <div class="mt-6 grid grid-cols-2">
      <slot name="body"/>
    </div>
  </div>
  <global-footer/>
</template>
