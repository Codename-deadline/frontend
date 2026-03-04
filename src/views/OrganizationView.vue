<script setup lang="ts">
import PageLayout from "@/components/home/common/PageLayout.vue";
import SectionHeader from "@/components/home/common/SectionHeader.vue";

</script>

<template>
  <page-layout :item-height="210.2" :distance="400"">
    <template #header>
      <section-header
        header-selector="organization.header"
        description-selector="organization.description"
        button-selector="actions.create"
      />
    </template>
  </page-layout>
</template>
