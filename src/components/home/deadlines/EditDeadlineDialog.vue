<script setup lang="ts">
import { type FormInst, type FormRules, NButton, NForm, NFormItem, NInput, NPopconfirm, NTabPane } from "naive-ui";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { addDeadlineAssignee, deleteDeadline, getDeadlineAssignees, patchDeadline, removeDeadlineAssignee } from "@/api/deadline";
import { changeDeadlineAssigneeRole } from "@/api/roles";
import type { DeadlineWithRole } from "@/api/schemas/deadline/common/Deadline";
import EntityDialoglayout from "@/components/home/common/dialogs/EntityDialoglayout.vue";
import MembersTab from "@/components/home/common/dialogs/members/MembersTab.vue";
import UserInvitationInput from "@/components/home/common/forms/UserInvitationInput.vue";
import { useEntityEdit } from "@/composables/useEntityEdit";
import { tEntityActionConfirmation, tFormError } from "@/locales/utils";
import emitter from "@/plugins/emitter";
import { msToIso } from "@/utils/date";
import DeadlineDatePicker from "./DeadlineDatePicker.vue";

const props = defineProps<{
  entity: DeadlineWithRole;
}>();

if (!props.entity.globalRole) {
  emitter.emit("closeEditEntityDialog");
}

const { t } = useI18n();

const extraFormRules: FormRules = {
  due: [{ required: true, type: "number", message: tFormError(t, "due-date"), trigger: ["input", "blur"] }],
};
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
  scopeType: "deadline",
  listType: "deadlines",
  entity: props.entity,
  patchFormRef,
  invitationFormRef,
  managePermissionKey: "manageAssignees",
  invitePermissionKey: "manageAssignees",
  memberStatKey: "assignees",
  defaultInvitationRole: "DDL_ASSIGNEE",
  initialFormModel: {
    title: props.entity.title,
    description: props.entity.description,
    due: props.entity.due,
  },
  extraFormRules,
  transformPatchData: (data) => ({
    ...data,
    due: msToIso(data.due),
  }),
  syncFields: ["due"],
  apiCalls: {
    patch: patchDeadline,
    delete: deleteDeadline,
    invite: addDeadlineAssignee,
    fetchMembers: getDeadlineAssignees,
    changeRole: changeDeadlineAssigneeRole,
    removeMember: removeDeadlineAssignee,
  },
});
</script>

<template>
  <EntityDialoglayout
    scope-type="deadline"
    :title="entity.title"
    :users-to-load="membersToLoad"
  >
    <n-tab-pane name="settings" :tab="t('scopes.common.form-sections.settings')">
      <n-form ref="patchFormRef" :model="patchFormModel" :rules="patchFormRules">
        <n-form-item :label="t('scopes.common.form-labels.title')" path="title">
          <n-input
            v-model:value="patchFormModel.title"
            :disabled="!entity.permissions.update"
            class="rounded-lg!"
          />
        </n-form-item>
        <n-form-item :label="t('scopes.common.form-labels.description')" path="description">
          <n-input
            v-model:value="patchFormModel.description"
            :disabled="!entity.permissions.update"
            class="rounded-lg!"
            type="textarea"
          />
        </n-form-item>
        <n-form-item :label="t('scopes.common.form-labels.due-date')" path="due">
          <deadline-date-picker
            v-model:value="patchFormModel.due"
            :disabled="!entity.permissions.update"
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
                role="button"
                :disabled="!entity.permissions.delete"
                class="rounded-lg!"
                type="error"
              >
                {{ t("actions.delete") }}
              </n-button>
            </template>
            {{ tEntityActionConfirmation(t, "thread", "delete") }}
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
        :members-stats="entity.stats.assignees"
        :can-manage-roles="canManageMembers"
        :my-role="myRoles.global ?? ''"
      />
    </n-tab-pane>
    <n-tab-pane
      v-if="canInvite"
      name="invites"
      :tab="t('scopes.common.form-sections.invitations')"
    >
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
