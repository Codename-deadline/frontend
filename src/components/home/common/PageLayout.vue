<script setup lang="ts">
import { useWindowSize } from "@vueuse/core";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import type { OrganizationWithRole } from "@/api/schemas/organization/common/Organization";
import { getOrganizations } from "@/api/user";
import EditOrganizationDialog from "@/components/home/organizations/EditOrganizationDialog.vue";
import OrganizationCard from "@/components/home/organizations/OrganizationCard.vue";
import { useInfiniteVirtualList } from "@/composables/useInfiniteVirtualList";
import GlobalFooter from "./GlobalFooter.vue";
import GlobalHeader from "./GlobalHeader.vue";

const props = defineProps<{
  itemHeight: number;
  distance?: number;
}>();
const { t } = useI18n();
const { width } = useWindowSize();
// These values are linked to the CSS below
// grid grid-cols-1... needs to be adjusted on change
const itemsPerRow = computed<number>(() => {
  if (width.value >= 1280) return 3;
  if (width.value >= 640) return 2;
  return 1;
});

const objectIdToEdit = ref<any>(null);
const isEditing = computed(() => objectIdToEdit.value !== null)

const { containerProps, wrapperProps, virtualItems, loading } = useInfiniteVirtualList<OrganizationWithRole>(
  "organizations",
  (page: number) => getOrganizations(page),
  {
    itemsPerRow,
    itemHeight: props.itemHeight,
    distance: props.distance,
  },
);
</script>

<template>
  <global-header class="mt"/>
  <div class="mt-8 layout-dynamic-padding">
    <slot name="header"/>
    <div class="mt-6">
      <div v-bind="containerProps" class="overflow-y-auto max-h-[72.5vh]">
        <div v-bind="wrapperProps" class="space-y-4">
          <div
            class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
            v-for="row in virtualItems"
            :key="row.index"
          >
             <organization-card
              @edit="objectIdToEdit = item"
              v-for="item in row.data"
              :key="item.id"
              :organization="item"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="flex justiftems-starty-center items-center">
      <div v-if="loading" style="text-align:center; padding: 16px;">
        {{ t(`state.loading`) }}
      </div>
    </div>
  </div>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100 backdrop-blur-sm"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isEditing"
      class="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        class="absolute inset-0 bg-black/30 backdrop-blur-sm"
        @click="objectIdToEdit = null"
      />

      <edit-organization-dialog
        class="relative min-w-1/3! w-fit! h-fit! rounded-xl!"
        :entity="objectIdToEdit"
        @close="objectIdToEdit = null"
      />
    </div>
  </Transition>
  <global-footer/>
</template>

<style>
@reference "@/styles.css";

.layout-dynamic-padding {
  @apply px-6 lg:px-24 2xl:px-32;
}
</style>
