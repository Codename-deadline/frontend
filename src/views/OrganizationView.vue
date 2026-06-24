<script setup lang="ts">
import { useRouter } from "vue-router";
import { getOrganizations } from "@/api/user";
import PageLayout from "@/components/home/common/PageLayout.vue";
import CreateOrganizationDialog from "@/components/home/organizations/CreateOrganizationDialog.vue";
import EditOrganizationDialog from "@/components/home/organizations/EditOrganizationDialog.vue";
import OrganizationCard from "@/components/home/organizations/OrganizationCard.vue";
import { useCurrentScopeStore } from "@/stores/CurrentScopeStore";

const router = useRouter();
const currentScopeStore = useCurrentScopeStore();

const onCardClick = (orgId: number) => {
  router.push({ path: '/threads', query: { orgId } });
  currentScopeStore.withScope(orgId, "organization");
}
</script>

<template>
  <page-layout
    @card-clicked="onCardClick"
    :entity-card-component="OrganizationCard"
    :edit-dialog-component="EditOrganizationDialog"
    :create-dialog-component="CreateOrganizationDialog"
    :fetcher="getOrganizations"
    :reset="true"
    scope-type="organization"
  />
</template>
