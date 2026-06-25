<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { getMyDeadlines, getThreadDeadlines } from '@/api/deadline';
import PageLayout from '@/components/home/common/PageLayout.vue';
import CreateDeadlineDialog from '@/components/home/deadlines/CreateDeadlineDialog.vue';
import DeadlineCard from '@/components/home/deadlines/DeadlineCard.vue';
import EditDeadlineDialog from '@/components/home/deadlines/EditDeadlineDialog.vue';
import { useCurrentScopeStore } from '@/stores/CurrentScopeStore';

const route = useRoute();
const currentScopeStore = useCurrentScopeStore();

const thrId = ref<number | undefined>(currentScopeStore.thread?.id);
if (!thrId.value && Number.isInteger(Number(route.query.thrId))) {
  thrId.value = Number(route.query.thrId);
}
const showCreateDeadlineButton = computed(
  () => Number.isInteger(thrId.value) && currentScopeStore.thread?.permissions.createDeadlines
);


const userDeadlineFetcher = (page: number) => getMyDeadlines(page);
const threadDeadlinesFetcher = (page: number) => getThreadDeadlines(thrId.value ?? -1, page);
const deadlineFetcher = computed(() => Number.isInteger(thrId.value) ? threadDeadlinesFetcher : userDeadlineFetcher)
</script>

<template>
  <page-layout
    :entity-card-component="DeadlineCard"
    :edit-dialog-component="EditDeadlineDialog"
    :create-dialog-component="CreateDeadlineDialog"
    :fetcher="deadlineFetcher"
    :show-create-button="showCreateDeadlineButton"
    :reset="true"
    scope-type="deadline"
  />
</template>
