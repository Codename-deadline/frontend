<script setup lang="ts">
import { type UseVirtualListItem, useWindowSize } from "@vueuse/core";
import { NSkeleton } from "naive-ui";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import type { PagedResponse } from "@/api/common/PaginationResponse";
import type { OrganizationInvitation } from "@/api/schemas/organization/invitation/Invitation";
import { useInfiniteVirtualList } from "@/composables/useInfiniteVirtualList";
import type { SafeApiCall } from "@/types/api";
import InvitationCard from "./InvitationCard.vue";

const props = defineProps<{
  variant: "received" | "sent";
  fetcher: (page: number) => Promise<SafeApiCall<PagedResponse<OrganizationInvitation>>>;
}>();

const { t } = useI18n();
const { width } = useWindowSize();
const CARD_HEIGHT = 179;

const itemsPerRow = computed(() => {
  if (width.value >= 640) return 2;
  return 1;
});

const listType = props.variant === "received" ? "invitations_received" : "invitations_sent";

const { containerProps, wrapperProps, virtualItems, loading } =
  useInfiniteVirtualList<OrganizationInvitation>(listType, props.fetcher, {
    itemsPerRow,
    itemHeight: CARD_HEIGHT,
  });

const items = computed<UseVirtualListItem<OrganizationInvitation[]>[]>(
  () => virtualItems.value as UseVirtualListItem<OrganizationInvitation[]>[],
);
</script>

<template>
  <div
    v-bind="containerProps"
    class="overflow-y-auto"
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
  </div>
  <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div v-for="i in itemsPerRow * 3" :key="i" :style="`height: ${CARD_HEIGHT}px`">
      <n-skeleton height="100%" width="100%" :sharp="false" />
    </div>
  </div>
  <div
    v-else-if="items.length === 0"
    class="w-full flex flex-col justify-center items-center description"
  >
    {{ t("state.no-entities-found", { entity: t("scopes.invitation.header").toLowerCase() }) }}
  </div>
</template>
