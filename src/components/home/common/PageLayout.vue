<script setup lang="ts">
import { useInfiniteVirtualList } from "@/composables/useInfiniteVirtualList";
import GlobalFooter from "./GlobalFooter.vue";
import GlobalHeader from "./GlobalHeader.vue";
import type { Organization } from "@/api/schemas/organization/common/Organization";
import { getOrganizations } from "@/api/user";
import OrganizationCard from "@/components/home/organizations/OrganizationCard.vue";

const {
  containerProps,
  wrapperProps,
  virtualItems,
  loading,
  hasMore,
} = useInfiniteVirtualList<Organization>(
  "organizations",
  (page: number) => getOrganizations(page), {
    itemHeight: 75
  }
)
</script>

<template>
  <global-header class="mt"/>
  <div class="mt-8 px-32">
    <slot name="header"/>
    <div class="mt-6 grid grid-cols-3 gap-4">
      <!-- <slot name="body"/> -->
      <organization-card
        v-for="item in virtualItems"
        :key="item.data.id"
        :title="item.data.title"
        :scope="item.data.type"
        role="owner"
        :stats="item.data.stats"
      />
        <div
        v-bind="containerProps"
        class="overflow-y-auto"
      >
        <div v-bind="wrapperProps">
           <!-- <organization-card
            v-for="item in virtualItems"
            :key="item.id"
            :title="item.data.title"
            :scope="item.data.type"
            role="test"
            :stats="item.data.stats"
          /> -->
          <!-- <div
            v-for="item in virtualItems"
            :key="item.index"
            :style="{ height: '70px', borderBottom: '1px solid #eee', padding: '12px' }"
          >
            {{ item.data.title }}
          </div> -->
        </div>
      </div>
    </div>
    <div class="flex h-full justify-center items-center">
      <div v-if="loading" style="text-align:center; padding: 16px;">
        Loading...
      </div>
    </div>
  </div>
  <global-footer/>
</template>
