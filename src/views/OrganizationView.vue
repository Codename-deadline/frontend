<script setup lang="ts">
import PageLayout from "@/components/home/common/PageLayout.vue";
import SectionHeader from "@/components/home/common/SectionHeader.vue";
import { CARD_HEIGHT_PIXELS, PRELOAD_DISTANCE_PIXELS } from "@/constants/virtualList";
</script>

<template>
  <page-layout :item-height="CARD_HEIGHT_PIXELS" :distance="PRELOAD_DISTANCE_PIXELS">
     <template #header>
      <section-header
        scope-type="organization"
        button-action="create"
      />
    </template>
  </page-layout>
</template>
