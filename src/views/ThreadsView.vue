<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getMyThreads, getOrganizationThreads } from '@/api/thread';
import PageLayout from '@/components/home/common/PageLayout.vue';
import CreateThreadDialog from '@/components/home/threads/CreateThreadDialog.vue';
import EditThreadDialog from '@/components/home/threads/EditThreadDialog.vue';
import ThreadCard from '@/components/home/threads/ThreadCard.vue';
import { useCurrentScopeStore } from '@/stores/CurrentScopeStore';

const router = useRouter();
const route = useRoute();
const currentScopeStore = useCurrentScopeStore();

const orgId = ref<number | null>(currentScopeStore.orgId);
if (!orgId.value && Number.isInteger(Number(route.query.orgId))) {
  orgId.value = Number(route.query.orgId);
  currentScopeStore.exitAndUpdate(orgId.value, "organization");
}

const userThreadsFetcher = (page: number) => getMyThreads(page);
const organizationThreadFetcher = (page: number) => getOrganizationThreads(orgId.value ?? -1, page);
const threadFetcher = computed(() => Number.isInteger(orgId.value) ? organizationThreadFetcher : userThreadsFetcher)

const onCardClick = (thrId: number) => {
  router.push({ path: '/deadlines', query: { thrId } });
  currentScopeStore.withScope(thrId, "thread");
}
</script>

<template>
  <page-layout
    @card-clicked="onCardClick"
    :entity-card-component="ThreadCard"
    :edit-dialog-component="EditThreadDialog"
    :create-dialog-component="CreateThreadDialog"
    :fetcher="threadFetcher"
    :show-create-button="Number.isInteger(orgId)"
    :reset="true"
    scope-type="thread"
  />
</template>
