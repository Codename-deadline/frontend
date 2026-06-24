<script setup lang="ts">
import { TrashAlt, UserFriends } from "@vicons/fa";
import { NButton, NCard, NIconWrapper, NTooltip } from 'naive-ui';
import { useI18n } from "vue-i18n";
import type { OrganizationInvitation } from '@/api/schemas/organization/invitation/Invitation';
import { useInvitationActions } from '@/composables/useInvitationActions';
import { getPopoverTrigger } from '@/utils/flags';
import RoleTag from '../common/RoleTag.vue';

const props = defineProps<{
  invitation: OrganizationInvitation;
  variant: "received" | "sent";
}>();

const { t } = useI18n();
const { accept, decline, revoke } = useInvitationActions(props.variant);
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
        <template v-if="variant === 'received'">
          <n-button
            type="info"
            class="flex-1 rounded-lg!"
            role="button"
            size="medium"
            @click.stop="accept(invitation.id)"
          >
             {{ t("actions.accept") }}
          </n-button>
          <n-button
            type="error"
            class="flex-1 rounded-lg!"
            role="button"
            size="medium"
            @click.stop="decline(invitation.id)"
          >
            {{ t("actions.decline") }}
          </n-button>
        </template>
        <n-button
          v-else
          type="error"
          class="flex-1 rounded-lg!"
          role="button"
          size="medium"
          @click.stop="revoke(invitation.id)"
        >
          <template #icon>
            <TrashAlt />
          </template>
          {{ t("actions.delete") }}
        </n-button>
      </div>
    </span>
  </div>
</n-card>
</template>
