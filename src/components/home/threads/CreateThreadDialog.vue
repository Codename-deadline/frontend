<script setup lang="ts">
import { ArrowLeft, ArrowRight } from '@vicons/fa';
import { type FormInst, type FormRules, NButton, NForm, NFormItem, NIcon, NInput, useMessage } from 'naive-ui';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import type { OrganizationInvitation } from '@/api/schemas/organization/Invitation';
import type { ThreadWithRole } from '@/api/schemas/thread/common/Thread';
import type { ThreadInvitation } from '@/api/schemas/thread/Invitation';
import { createThread } from '@/api/thread';
import EntityCreationDialogLayout from '@/components/home/common/dialogs/EntityCreationDialogLayout.vue';
import DynamicUserInvitationInput from '@/components/home/common/forms/DynamicUserInvitationInput.vue';
import Step from '@/components/home/common/stepper/Step.vue';
import { useApi } from '@/composables/useApi';
import { tEntityToastAction, tFormError } from '@/locales/utils';
import emitter from '@/plugins/emitter';
import { useInfiniteListStore } from '@/stores/InfiniteListStore';
import { deduplicateInvitationsByUsername } from '@/utils';

const { t } = useI18n();
const { makeRequest } = useApi();
const message = useMessage();
const { addOne } = useInfiniteListStore();

// TODO: This can potentially be a global page state
// As a thread view can be in two distinct states:
// 1. View organization threads
// 2. View all user assigned threads
const route = useRoute();

const isOrgIdProvided = Number.isInteger(Number(route.query.orgId));
const organizationId: number = isOrgIdProvided ? Number.parseInt(route.query.orgId as string, 10) : -1;
if (!isOrgIdProvided) {
  emitter.emit("closeCreateEntityDialog");
}
const invitationFormModel = ref<OrganizationInvitation[]>([]);

const threadFormRef = ref<FormInst | null>(null);
const threadFormModel = ref<{
  title: string,
  description: string,
}>({ title: "", description: "" });
const threadFormRules: FormRules = {
  title: [
    { required: true, message: tFormError(t, "title"), trigger: ["input", "blur"] },
  ],
}
const validateFormData = (nextStep: () => void) => {
  threadFormRef.value?.validate((errors) => {
    if (errors) {
      console.error(errors);
      return;
    }

    nextStep();
  })
}

const handleThreadCreation = async () => {
  const uniqueInvitations: ThreadInvitation[] = deduplicateInvitationsByUsername(invitationFormModel.value);

  // TODO: Support proper roles
  const res = await makeRequest(() => createThread(organizationId, {
    title: threadFormModel.value.title,
    description: threadFormModel.value.description,
    usersToAssign: uniqueInvitations.map(x => x.username),
  }))

  if (!res.ok) return;
  message.success(tEntityToastAction(t, "thread", "created"));

  emitter.emit("closeCreateEntityDialog");

  // TODO: Increment number of threads in the organization

  // All the mandatory data except for `createdAt` is known at this point
  // Id was returned by the server. The rest is known locally
  // User is automatically assigned to the thread and has all the rights
  addOne<ThreadWithRole>("threads", {
    id: res.data.threadId,
    title: threadFormModel.value.title,
    description: threadFormModel.value.description,
    organizationId: organizationId,
    createdAt: new Date().toUTCString(),
    stats: {
      assignees: 0,
      deadlines: 0,
      completedDeadlines: 0
    },
    permissions: {
      createDeadlines: true,
      delete: true,
      manageAssignees: true,
      update: true
    },
    role: "THR_OWNER"
  })
}
</script>

<template>
  <EntityCreationDialogLayout scope-type="thread">
    <Step title="Details" :value="1" v-slot="{ nextStep }">
      <n-form ref="threadFormRef" :model="threadFormModel" :rules="threadFormRules">
        <n-form-item :label="t('scopes.common.form-labels.title')" path="title">
          <n-input v-model:value="threadFormModel.title" />
        </n-form-item>
        <n-form-item :label="t('scopes.common.form-labels.description')" path="description">
          <n-input v-model:value="threadFormModel.description" type="textarea"/>
        </n-form-item>
      </n-form>
      <div class="flex flex-1 justify-end">
        <n-button @click="() => validateFormData(nextStep!)">
          <template #icon>
            <n-icon>
              <ArrowRight />
            </n-icon>
          </template>
        </n-button>
      </div>
    </Step>
    <Step title="Invitations" :value="2" v-slot="{ prevStep }">
      <n-form ref="invitationFormRef" :model="invitationFormModel">
        <n-form-item :label="t('scopes.common.form-labels.invitations')" path="username">
          <!-- TODO: Remove hardcoded ORG_MEMBER -->
          <DynamicUserInvitationInput
            v-model="invitationFormModel"
            default-role="THR_ASSIGNEE"
            :placeholder="t('scopes.thread.no-assignees')"
          />
        </n-form-item>
      </n-form>
      <div class="flex flex-1 justify-between">
        <n-button @click="prevStep">
          <n-icon>
            <ArrowLeft />
          </n-icon>
        </n-button>
        <n-button @click="handleThreadCreation" type="info"> {{ t("actions.create") }} </n-button>
      </div>
    </Step>
  </EntityCreationDialogLayout>
</template>
