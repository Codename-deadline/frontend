<script setup lang="ts">
import { UserFriends } from "@vicons/fa";
import { NButton, NCard, NIconWrapper } from 'naive-ui';
import { useI18n } from "vue-i18n";
import type { OrganizationInvitation } from '@/api/schemas/organization/invitation/Invitation';
import { getPopoverTrigger } from '@/utils/flags';
import RoleTag from '../common/RoleTag.vue';

defineProps<{
  invitation: OrganizationInvitation
}>();

const { t } = useI18n();
const emit = defineEmits<{
  accepted: [invitationId: number],
  declined: [invitationId: number]
}>();
</script>

<template>
<n-card class="rounded-lg! mb-2">
  <div class="flex space-x-3">
    <span>
      <n-icon-wrapper color="" :size="48" :border-radius="16">
        <Icon color="white" size="24">
          <UserFriends/>
        </Icon>
      </n-icon-wrapper>
    </span>
    <span class="w-full flex flex-col">
      <div>
        <h3>{{ invitation.organization.title }}</h3>
        <span class="description flex">
          <n-tooltip placement="bottom" :trigger="getPopoverTrigger()">
            <template #trigger>
              <div class="cursor-help"> {{ `@${invitation.invitedBy.username}` }} </div>
            </template>
            <span> {{ t("scopes.invitation.invited-by") }} {{ invitation.invitedBy.fullName ?? "Full name unknown" }} </span>
          </n-tooltip>
          <span class="mx-1">•</span>
          <span>2 weeks ago</span>
        </span>
        <role-tag class="my-1" scope-type="organization" :role="invitation.role" />
      </div>
      <div class="flex w-full space-x-2! mt-3">
        <n-button
          type="info"
          class="flex-1 rounded-lg!"
          role="button"
          size="medium"
          @click="() => emit('accepted', invitation.id)"
        >
           {{ t("actions.accept") }}
        </n-button>
        <n-button
          type="error"
          class="flex-1 rounded-lg!"
          role="button"
          size="medium"
          @click="() => emit('declined', invitation.id)"
        >
          {{ t("actions.decline") }} 
        </n-button>
      </div>
    </span> 
  </div>
</n-card>
</template>
