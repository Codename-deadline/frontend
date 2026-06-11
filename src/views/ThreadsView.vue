<script setup lang="ts">
import { useRoute } from 'vue-router';
import { getOrganizationThreads } from '@/api/thread';
import PageLayout from '@/components/home/common/PageLayout.vue';
import CreateThreadDialog from '@/components/home/threads/CreateThreadDialog.vue';
import EditThreadDialog from '@/components/home/threads/EditThreadDialog.vue';
import ThreadCard from '@/components/home/threads/ThreadCard.vue';

const route = useRoute();
// TODO: Fetch user threads by default
let threadFetcher = (page: number) => getOrganizationThreads(1, page);
if (Number.isInteger(Number(route.query.orgId))) {
  threadFetcher = (page: number) => getOrganizationThreads(Number(route.query.orgId), page)
}
</script>

<template>
  <page-layout
    :entity-card-component="ThreadCard"
    :edit-dialog-component="EditThreadDialog"
    :create-dialog-component="CreateThreadDialog"
    :fetcher="threadFetcher"
    scope-type="thread"
  />
</template>
