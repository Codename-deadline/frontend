<script setup lang="ts">
import { type UseVirtualListItem, useWindowSize } from "@vueuse/core";
import { NSkeleton, NTabPane, NTabs } from "naive-ui";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { getPendingInvitations, getSentInvitations } from "@/api/invitation";
import type { OrganizationInvitation } from "@/api/schemas/organization/invitation/Invitation";
import GlobalFooter from "@/components/home/common/GlobalFooter.vue";
import GlobalHeader from "@/components/home/common/GlobalHeader.vue";
import SectionHeader from "@/components/home/common/SectionHeader.vue";
import InvitationCard from "@/components/home/invitations/InvitationCard.vue";
import { useInfiniteVirtualList } from "@/composables/useInfiniteVirtualList";

const { t } = useI18n();
const { width } = useWindowSize();
const activeTab = ref<"received" | "sent">("received");

const itemsPerRow = computed(() => {
  if (width.value >= 640) return 2;
  return 1;
});
const CARD_HEIGHT: number = 176;

const receivedList = useInfiniteVirtualList<OrganizationInvitation>(
  "invitations_received",
  getPendingInvitations,
  { itemsPerRow, itemHeight: CARD_HEIGHT },
);

const sentList = useInfiniteVirtualList<OrganizationInvitation>(
  "invitations_sent",
  getSentInvitations,
  { itemsPerRow, itemHeight: CARD_HEIGHT },
);

const receivedItems = computed<UseVirtualListItem<OrganizationInvitation[]>[]>(
  () => receivedList.virtualItems.value as UseVirtualListItem<OrganizationInvitation[]>[],
);
const sentItems = computed<UseVirtualListItem<OrganizationInvitation[]>[]>(
  () => sentList.virtualItems.value as UseVirtualListItem<OrganizationInvitation[]>[],
);
</script>

<template>
  <global-header />
  <div class="mt-8 layout-dynamic-padding">
    <section-header
      :section="'invitation'"
      :show-create-button="false"
      button-action="create"
    />
    <n-tabs v-model:value="activeTab" class="mt-6">
      <n-tab-pane name="received" :tab="t('scopes.invitation.received')" />
      <n-tab-pane name="sent" :tab="t('scopes.invitation.sent')" />
    </n-tabs>
    <div v-show="activeTab === 'received'" class="mt-6">
      <div v-bind="receivedList.containerProps" class="overflow-y-auto max-h-[65vh]">
        <div v-bind="receivedList.wrapperProps" class="space-y-4">
          <div
            class="grid grid-cols-1 sm:grid-cols-2 gap-4"
            v-for="row in receivedItems"
            :key="row.index"
          >
            <InvitationCard
              v-for="item in row.data"
              :key="item.id"
              variant="received"
              :invitation="item"
            />
          </div>
        </div>
      </div>
      <div v-if="receivedList.loading.value" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-for="i in itemsPerRow * 3" :key="i" :style="`height: ${CARD_HEIGHT}px`">
          <n-skeleton height="100%" width="100%" :sharp="false" />
        </div>
      </div>
      <div
        v-else-if="receivedItems.length === 0"
        class="w-full flex flex-col justify-center items-center description"
      >
        {{ t("state.no-entities-found", { entity: t("scopes.invitation.header").toLowerCase() }) }}
      </div>
    </div>
    <div v-show="activeTab === 'sent'" class="mt-6">
      <div v-bind="sentList.containerProps" class="overflow-y-auto max-h-[65vh]">
        <div v-bind="sentList.wrapperProps" class="space-y-4">
          <div
            class="grid grid-cols-1 sm:grid-cols-2 gap-4"
            v-for="row in sentItems"
            :key="row.index"
          >
            <InvitationCard
              v-for="item in row.data"
              :key="item.id"
              variant="sent"
              :invitation="item"
            />
          </div>
        </div>
      </div>
      <div v-if="sentList.loading.value" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-for="i in itemsPerRow * 3" :key="i" :style="`height: ${CARD_HEIGHT}px`">
          <n-skeleton height="100%" width="100%" :sharp="false" />
        </div>
      </div>
      <div
        v-else-if="sentItems.length === 0"
        class="w-full flex flex-col justify-center items-center description"
      >
        {{ t("state.no-entities-found", { entity: t("scopes.invitation.header").toLowerCase() }) }}
      </div>
    </div>
  </div>
  <global-footer />
</template>
