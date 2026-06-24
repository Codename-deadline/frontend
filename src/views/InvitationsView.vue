<script setup lang="ts">
import { NTabPane, NTabs } from "naive-ui";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { getPendingInvitations, getSentInvitations } from "@/api/invitation";
import GlobalFooter from "@/components/home/common/GlobalFooter.vue";
import GlobalHeader from "@/components/home/common/GlobalHeader.vue";
import SectionHeader from "@/components/home/common/SectionHeader.vue";
import InvitationList from "@/components/home/invitations/InvitationList.vue";

const { t } = useI18n();
const activeTab = ref<"received" | "sent">("received");
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
      <InvitationList
        :fetcher="getPendingInvitations"
        :reset="true"
        variant="received"
      />
    </div>
    <div v-show="activeTab === 'sent'" class="mt-6">
      <InvitationList
        :fetcher="getSentInvitations"
        :reset="true"
        variant="sent"
      />
    </div>
  </div>
  <global-footer />
</template>
