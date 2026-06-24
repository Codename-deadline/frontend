<script setup lang="ts">
import { getPendingInvitations } from "@/api/invitation";
import PageLayout from "@/components/home/common/PageLayout.vue";
import EditInvitationDialog from "@/components/home/invitations/EditInvitationDialog.vue";
import InvitationCard from "@/components/home/invitations/InvitationCard.vue";
import EditOrganizationDialog from "@/components/home/organizations/EditOrganizationDialog.vue";

const invitationFetcher = (page: number) => getPendingInvitations(page);
</script>

<template>
  <page-layout
    :entity-card-component="InvitationCard"
    :edit-dialog-component="EditOrganizationDialog"
    :show-create-button="false"
    :fetcher="invitationFetcher"
    scope-type="invitation"
  />
</template>
