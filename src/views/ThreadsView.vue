<script setup lang="ts">
import { useRoute } from 'vue-router';
import { getOrganizationThreads } from '@/api/thread';
import PageLayout from '@/components/home/common/PageLayout.vue';
import CreateOrganizationDialog from '@/components/home/organizations/CreateOrganizationDialog.vue';
import EditOrganizationDialog from '@/components/home/organizations/EditOrganizationDialog.vue';
import ThreadCard from '@/components/home/threads/ThreadCard.vue';

const route = useRoute();
// TODO: Fetch user threads by default
let threadFetcher = (page: number) => getOrganizationThreads(1, page);
if (Number.isInteger(route.query.orgId)) {
  threadFetcher = (page: number) => getOrganizationThreads(Number(route.query.orgId), page)
}
</script>

<template>
  <page-layout
    :entity-card-component="ThreadCard"
    :edit-dialog-component="EditOrganizationDialog"
    :create-dialog-component="CreateOrganizationDialog"
    :fetcher="threadFetcher!"
    scope-type="thread"
  />
</template>
