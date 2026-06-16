<script setup lang="ts">
import { type FormInst, NButton, NForm, NFormItem, NInput, NPopconfirm, NTabPane } from "naive-ui";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import {
  deleteOrganization,
  getOrganizationMembers,
  inviteMemberToOrganization,
  patchOrganization,
  removeOrganizationMember,
} from "@/api/organization";
import { changeOrganizationMemberRole } from "@/api/roles";
import type { OrganizationWithRole } from "@/api/schemas/organization/common/Organization";
import EntityDialoglayout from "@/components/home/common/dialogs/EntityDialoglayout.vue";
import MembersTab from "@/components/home/common/dialogs/members/MembersTab.vue";
import UserInvitationInput from "@/components/home/common/forms/UserInvitationInput.vue";
import { useEntityEdit } from "@/composables/useEntityEdit";
import { tEntityActionConfirmation } from "@/locales/utils";

const props = defineProps<{
  entity: OrganizationWithRole;
}>();

const { t } = useI18n();

const patchFormRef = ref<FormInst | null>(null);
const invitationFormRef = ref<FormInst | null>(null);

const {
  patchFormModel,
  patchFormRules,
  handlePatch,
  handleDelete,
  invitationFormModel,
  invitationFormRules,
  handleInvitationSubmission,
  handleFetchMembers,
  handleRoleUpdate,
  handleRemoveMember,
  canManageMembers,
  canInvite,
  myRoles,
  membersToLoad,
} = useEntityEdit({
  scopeType: "organization",
  listType: "organizations",
  entity: props.entity,
  patchFormRef,
  invitationFormRef,
  managePermissionKey: "manageRoles",
  invitePermissionKey: "invite",
  statsField: "members",
  defaultInvitationRole: "ORG_MEMBER",
  apiCalls: {
    patch: patchOrganization,
    delete: deleteOrganization,
    invite: inviteMemberToOrganization,
    fetchMembers: getOrganizationMembers,
    changeRole: changeOrganizationMemberRole,
    removeMember: removeOrganizationMember,
  },
});
</script>

<template>
  <EntityDialoglayout
    scope-type="organization"
    :title="entity.title"
    :users-to-load="membersToLoad"
  >
    <n-tab-pane name="settings" :tab="t('scopes.common.form-sections.settings')">
      <n-form ref="patchFormRef" :model="patchFormModel" :rules="patchFormRules">
        <n-form-item :label="t('scopes.common.form-labels.title')" path="title">
          <n-input
            :disabled="!entity.permissions.update"
            class="rounded-lg!"
            v-model:value="patchFormModel.title"
          />
        </n-form-item>
        <n-form-item :label="t('scopes.common.form-labels.description')" path="description">
          <n-input
            :disabled="!entity.permissions.update"
            class="rounded-lg!"
            v-model:value="patchFormModel.description"
            type="textarea"
          />
        </n-form-item>
        <div class="grid grid-cols-3 px-4 mt-6">
          <n-popconfirm
            :disabled="!entity.permissions.delete"
            @positive-click="handleDelete"
            class="rounded-lg!"
          >
            <template #trigger>
              <n-button
                :disabled="!entity.permissions.delete"
                class="rounded-lg!"
                type="error"
              >
                {{ t("actions.delete") }}
              </n-button>
            </template>
            {{ tEntityActionConfirmation(t, "organization", "delete") }}
          </n-popconfirm>
          <div></div>
          <n-button role="button" @click="handlePatch" class="rounded-lg!" type="info">
            {{ t("actions.save") }}
          </n-button>
        </div>
      </n-form>
    </n-tab-pane>
    <n-tab-pane name="members" tab="Members">
      <MembersTab
        :fetcher="handleFetchMembers"
        :update-member-role="handleRoleUpdate"
        :remove-member="handleRemoveMember"
        :members-stats="entity.stats.members"
        :can-manage-roles="canManageMembers"
        :my-role="myRoles.global ?? ''"
      />
    </n-tab-pane>
    <n-tab-pane v-if="canInvite" name="invites" :tab="t('scopes.common.form-sections.invitations')">
      <n-form ref="invitationFormRef" :model="invitationFormModel" :rules="invitationFormRules">
        <n-form-item :label="t('scopes.common.form-labels.username')" path="username">
          <UserInvitationInput
            :invitation-button="true"
            v-model:username="invitationFormModel.username"
            v-model:role="invitationFormModel.role"
            @click="handleInvitationSubmission"
          />
        </n-form-item>
      </n-form>
    </n-tab-pane>
  </EntityDialoglayout>
</template>
