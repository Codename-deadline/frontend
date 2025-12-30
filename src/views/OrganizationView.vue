<script setup lang="ts">
import PageLayout from "@/components/home/common/PageLayout.vue";
import SectionHeader from "@/components/home/common/SectionHeader.vue";
import OrganizationCard from "@/components/home/organizations/OrganizationCard.vue";
</script>

<template>
  <page-layout>
    <template #header>
      <section-header
        header-selector="organization.header"
        description-selector="organization.description"
        button-selector="organization.new"
      />
    </template>
    <template #body>
      <organization-card
        scope="PRIVATE"
        title="Product Team"
        role="Admin"
      />
    </template>
  </page-layout>
</template>
