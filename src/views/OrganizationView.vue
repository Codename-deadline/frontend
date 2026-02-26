<script setup lang="ts">
import PageLayout from "@/components/home/common/PageLayout.vue";
import SectionHeader from "@/components/home/common/SectionHeader.vue";

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
    <!-- <template #body>
      <div
        v-bind="containerProps"
        class="overflow-y-auto"
      >
        <div v-bind="wrapperProps">
          <div
            v-for="item in virtualItems"
            :key="item.index"
            :style="{ height: '70px', borderBottom: '1px solid #eee', padding: '12px' }"
          >
            {{ item.data.title }}
          </div>
        </div>
        <div class="flex justify-center items-center">
          <div v-if="loading" style="text-align:center; padding: 16px;">
            Loading...
          </div>
          <div v-if="!hasMore && !loading" style="text-align:center; padding: 16px;">
            No more items
          </div>
        </div>
      </div>
    </template> -->
  </page-layout>
</template>
