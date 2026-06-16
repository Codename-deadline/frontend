<script setup lang="ts">
import { type FormInst, type FormRules, NButton, NForm, NFormItem, NInput, NPopconfirm, NTabPane, useMessage } from 'naive-ui';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { changeThreadAssigneeRole } from '@/api/roles';
import type { ChangeThreadRoleRequest } from '@/api/schemas/roles/requests/ChangeThreadRoleRequest';
import type { ThreadWithRole } from '@/api/schemas/thread/common/Thread';
import type { ThreadInvitation } from '@/api/schemas/thread/Invitation';
import { addThreadAssignee, deleteThread, getThreadAssignees, patchThread, removeThreadAssignee } from '@/api/thread';
import EntityDialoglayout from '@/components/home/common/dialogs/EntityDialoglayout.vue';
import MembersTab from '@/components/home/common/dialogs/members/MembersTab.vue';
import UserInvitationInput from '@/components/home/common/forms/UserInvitationInput.vue';
import { useApi } from '@/composables/useApi';
import { DEFAULT_MEMBERS_PAGE_SIZE } from '@/constants/defaults';
import { tEntityActionConfirmation, tEntityToastAction, tFormError } from '@/locales/utils';
import emitter from '@/plugins/emitter';
import { useInfiniteListStore } from '@/stores/InfiniteListStore';


const props = defineProps<{
  entity: ThreadWithRole;
}>();

if (!props.entity.globalRole) {
  emitter.emit('closeEditEntityDialog');
}

const { makeRequest } = useApi();
const message = useMessage();
const { t } = useI18n();

const membersToLoad = DEFAULT_MEMBERS_PAGE_SIZE;

const patchFormRef = ref<FormInst | null>(null);
const patchFormModel = ref<{
  title: string;
  description: string | undefined;
}>({
  title: props.entity.title,
  description: props.entity.description,
});
const patchFormRules: FormRules = {
  title: [
    { required: true, message: 'Title is required', trigger: ["input", "blur"] },
  ],
  description: [
    { required: false },
  ],
}
const handleThreadPatch = async (e: MouseEvent) => {
  e.preventDefault();
  patchFormRef.value?.validate(async (errors) => {
    console.error(errors);
    if (errors) return;

    const res = await makeRequest(() => patchThread(props.entity.id, patchFormModel.value))
    if (!res.ok) return;

    props.entity.title = patchFormModel.value.title;
    props.entity.description = patchFormModel.value.description;
    message.success(tEntityToastAction(t, "thread", "updated"));
  })
}

const invitationFormRef = ref<FormInst | null>(null);
const invitationFormModel = ref<ThreadInvitation>({
  username: "",
  role: "THR_ASSIGNEE",
});
const invitationFormRules: FormRules = {
  username: [
    { required: true, message: tFormError(t, "username"), trigger: ["input", "blur"] },
  ]
}
const handleInvitationSubmission = async () => {
  invitationFormRef.value?.validate(async (errors) => {
    if (errors) {
      console.error(errors);
      return;
    }

    const res = await makeRequest(() => addThreadAssignee(props.entity.id, {
      username: invitationFormModel.value.username.trim().replace('@', ''),
      role: invitationFormModel.value.role
    }))
    if (!res.ok) return;

    message.success(t("scopes.toasts.member-invited"));
    invitationFormModel.value.username = "";
  })
}
const handleThreadDelete = async (e: MouseEvent) => {
  e.preventDefault();

  const res = await makeRequest(() => deleteThread(props.entity.id));
  if (!res.ok) return;

  const infiniteListStore = useInfiniteListStore();
  infiniteListStore.removeItem<ThreadWithRole>("threads", props.entity.id);

  emitter.emit('closeEditEntityDialog');
  message.success(tEntityToastAction(t, "thread", "deleted"));
}

const handleLoadingAssignees = (page: number) => {
  return getThreadAssignees(props.entity.id, page, membersToLoad);
}
const handleAssigneeRoleUpdate = async (request: ChangeThreadRoleRequest) => {
  return changeThreadAssigneeRole(props.entity.id, request);
};
const handleAssigneeRemoval = async (username: string) => {
  --props.entity.stats.assignees;
  return removeThreadAssignee(props.entity.id, username);
};
</script>

<template>
  <EntityDialoglayout
    v-if="entity.globalRole"
    scope-type="thread"
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
            @positive-click="handleThreadDelete"
            class="rounded-lg!"
          >
            <template #trigger>
              <n-button role="button" :disabled="!entity.permissions.delete" class="rounded-lg!" type="error">{{ t('actions.delete') }}</n-button>
            </template>
            {{ tEntityActionConfirmation(t, "thread", "delete") }}
          </n-popconfirm>
          <div></div>
          <n-button role="button" @click="handleThreadPatch" class="rounded-lg!" type="info">{{ t('actions.save') }}</n-button>
        </div>
      </n-form>
    </n-tab-pane>
    <n-tab-pane name="members" tab="Members">
      <MembersTab
        :fetcher="handleLoadingAssignees"
        :update-member-role="handleAssigneeRoleUpdate"
        :remove-member="handleAssigneeRemoval"
        :members-stats="entity.stats.assignees"
        :can-manage-roles="entity.permissions.manageAssignees"
        :my-role="entity.globalRole"
      />
    </n-tab-pane>
    <n-tab-pane v-if="entity.permissions.manageAssignees" name="invites" :tab="t('scopes.common.form-sections.invitations')">
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
