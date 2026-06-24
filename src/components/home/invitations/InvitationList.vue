<script setup lang="ts">
import { type UseVirtualListItem, useWindowSize } from "@vueuse/core";
import { NSkeleton } from "naive-ui";
import { computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import type { PagedResponse } from "@/api/common/PaginationResponse";
import type { OrganizationInvitation } from "@/api/schemas/organization/invitation/Invitation";
import { useInfiniteVirtualList } from "@/composables/useInfiniteVirtualList";
import type { SafeApiCall } from "@/types/api";
import InvitationCard from "./InvitationCard.vue";

const props = defineProps<{
  variant: "received" | "sent";
  fetcher: (page: number) => Promise<SafeApiCall<PagedResponse<OrganizationInvitation>>>;
  reset?: boolean
}>();

const { t } = useI18n();
const { width } = useWindowSize();
const CARD_HEIGHT = 179;

const itemsPerRow = computed(() => {
  if (width.value >= 640) return 2;
  return 1;
});

const listType = props.variant === "received" ? "invitations_received" : "invitations_sent";

const { containerProps, wrapperProps, virtualItems, showSkeleton, $reset } =
  useInfiniteVirtualList<OrganizationInvitation>(listType, props.fetcher, {
    itemsPerRow,
    itemHeight: CARD_HEIGHT,
  });

const items = computed<UseVirtualListItem<OrganizationInvitation[]>[]>(
  () => virtualItems.value as UseVirtualListItem<OrganizationInvitation[]>[],
);

watch(() => props.reset, (value) => {
  if (value) $reset();
}, { immediate: true });
</script>

<template>
  <div class="grid">
    <div
      v-bind="containerProps"
      class="overflow-y-auto col-start-1 row-start-1"
      :class="{ 'h-[65vh]': items.length > 0 }"
    >
      <div v-bind="wrapperProps" class="space-y-4">
        <div
          class="grid grid-cols-1 sm:grid-cols-2 gap-4"
          v-for="row in items"
          :key="row.index"
        >
          <InvitationCard
            v-for="item in row.data"
            :key="item.id"
            :variant="variant"
            :invitation="item"
          />
        </div>
      </div>
      <div
        v-if="!showSkeleton && items.length === 0"
        class="w-full flex flex-col justify-center items-center description py-10"
      >
        {{ t("state.no-entities-found", { entity: t("scopes.invitation.header").toLowerCase() }) }}
      </div>
    </div>
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showSkeleton" key="skeleton" class="z-100 col-start-1 row-start-1 grid grid-cols-1 sm:grid-cols-2 gap-4 pointer-events-none">
        <div v-for="i in itemsPerRow * 3" :key="i" :style="`height: ${CARD_HEIGHT}px`">
          <n-skeleton height="100%" width="100%" :sharp="false" />
        </div>
      </div>
    </Transition>
  </div>
</template>
