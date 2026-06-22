<script setup lang="ts">
import { ArrowLeft, ArrowRight } from "@vicons/fa";
import { type FormInst, type FormRules, NButton, NForm, NFormItem, NIcon, NInput } from "naive-ui";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { createDeadline } from "@/api/deadline";
import type { DeadlineWithRole } from "@/api/schemas/deadline/common/Deadline";
import type { DeadlineRole } from "@/api/schemas/deadline/common/DeadlineRole";
import type { CreateDeadlineResponse } from "@/api/schemas/deadline/create/CreateDeadlineResponse";
import EntityCreationDialogLayout from "@/components/home/common/dialogs/EntityCreationDialogLayout.vue";
import DynamicUserInvitationInput from "@/components/home/common/forms/DynamicUserInvitationInput.vue";
import Step from "@/components/home/common/stepper/Step.vue";
import { useEntityCreate } from "@/composables/useEntityCreate";
import { tFormError } from "@/locales/utils";
import emitter from "@/plugins/emitter";
import { msToIso } from "@/utils/date";
import DeadlineDatePicker from "./DeadlineDatePicker.vue";

// TODO: This can potentially be a global page state
// As a thread view can be in two distinct states:
// 1. View organization threads
// 2. View all user assigned threads
const route = useRoute();

const isThrIdProvided = Number.isInteger(Number(route.query.thrId));
const thrId: number = isThrIdProvided
  ? Number.parseInt(route.query.thrId as string, 10)
  : -1;
if (!isThrIdProvided) {
  emitter.emit("closeCreateEntityDialog");
}

const { t } = useI18n();
const ONE_HOUR: number = 3600000 // 60 * 60 * 1000

type DeadlineFormModel = {
  title: string;
  description: string;
  due: number; // n-date-picker expects a number | null, but the api expects an ISO 8601 string!
}

const formRef = ref<FormInst | null>(null);
const invitationFormRef = ref<FormInst | null>(null);

const defaultInvitationRole: DeadlineRole = "DDL_ASSIGNEE"
const extraFormRules: FormRules = {
  due: [{ required: true, type: "number", message: tFormError(t, "due-date"), trigger: ["input", "blur"] }],
};
const { formModel, formRules, invitationFormModel, validateFormData, handleCreation } = useEntityCreate<
  DeadlineFormModel,
  DeadlineWithRole,
  CreateDeadlineResponse
>({
  scopeType: "deadline",
  listType: "deadlines",
  defaultInvitationRole,
  invitationPlaceholder: t("scopes.deadline.no-assignees"),
  formRef,
  invitationFormRef,
  initialFormModel: { title: "", description: "", due: Date.now() + ONE_HOUR },
  extraFormRules,
  createApiCall: async (formData, invitations) =>
    createDeadline(thrId, {
      title: formData.title,
      description: formData.description,
      due: msToIso(formData.due),
      invitations: invitations,
    }),
  buildEntity: (response, formData) => ({
    id: response.deadlineId,
    title: formData.title,
    description: formData.description,
    due: formData.due,
    threadId: thrId,
    createdAt: Date.now(),
    stats: {
      assignees: response.assignees,
      attachments: 0,
    },
    permissions: {
      update: true,
      delete: true,
      manageAssignees: true,
      manageAttachments: true
    },
    role: "DDL_OWNER",
  }),
});
</script>

<template>
  <EntityCreationDialogLayout scope-type="deadline">
    <Step title="Details" :value="1" v-slot="{ nextStep }">
      <n-form ref="formRef" :model="formModel" :rules="formRules">
        <n-form-item :label="t('scopes.common.form-labels.title')" path="title">
          <n-input v-model:value="formModel.title" />
        </n-form-item>
        <n-form-item :label="t('scopes.common.form-labels.description')" path="description">
          <n-input v-model:value="formModel.description" type="textarea" />
        </n-form-item>
        <div class="flex justify-center">
          <n-form-item :label="t('scopes.common.form-labels.due-date')" path="due">
            <deadline-date-picker v-model:value="formModel.due"/>
          </n-form-item>
        </div>
      </n-form>
      <div class="flex flex-1 justify-end">
        <n-button role="button" @click="() => validateFormData(nextStep!)">
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
          <DynamicUserInvitationInput
            v-model="invitationFormModel"
            :default-role="defaultInvitationRole"
            :placeholder="t('scopes.deadline.no-assignees')"
          />
        </n-form-item>
      </n-form>
      <div class="flex flex-1 justify-between">
        <n-button role="button" @click="prevStep">
          <n-icon>
            <ArrowLeft />
          </n-icon>
        </n-button>
        <n-button role="button" @click="handleCreation" type="info">
          {{ t("actions.create") }}
        </n-button>
      </div>
    </Step>
  </EntityCreationDialogLayout>
</template>
