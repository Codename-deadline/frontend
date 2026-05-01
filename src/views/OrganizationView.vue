<script setup lang="ts">
import { useRouter } from "vue-router";
import { getOrganizations } from "@/api/user";
import PageLayout from "@/components/home/common/PageLayout.vue";
import CreateOrganizationDialog from "@/components/home/organizations/CreateOrganizationDialog.vue";
import EditOrganizationDialog from "@/components/home/organizations/EditOrganizationDialog.vue";
import OrganizationCard from "@/components/home/organizations/OrganizationCard.vue";

const router = useRouter();
</script>

<template>
  <page-layout
    @card-clicked="(orgId: number) => router.push({ path: '/threads', query: { orgId } })"
    :entity-card-component="OrganizationCard"
    :edit-dialog-component="EditOrganizationDialog"
    :create-dialog-component="CreateOrganizationDialog"
    :fetcher="getOrganizations"
    scope-type="organization"
  />
</template>
