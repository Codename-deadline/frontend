<script setup lang="ts">
import { ArrowLeft, ArrowRight } from '@vicons/fa';
import { type FormInst, type FormRules, NButton, NForm, NFormItem, NIcon, NInput, NSelect, useMessage } from 'naive-ui';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { createOrganization } from '@/api/organization';
import type { OrganizationWithRole } from '@/api/schemas/organization/common/Organization';
import type { OrganizationType } from '@/api/schemas/organization/common/OrganizationType';
import type { OrganizationInvitation } from '@/api/schemas/organization/Invitation';
import EntityCreationDialogLayout from '@/components/home/common/dialogs/EntityCreationDialogLayout.vue';
import DynamicUserInvitationInput from '@/components/home/common/forms/DynamicUserInvitationInput.vue';
import Step from '@/components/home/common/stepper/Step.vue';
import { useApi } from '@/composables/useApi';
import { tEntityToastAction, tFormError, tScopePrefix } from '@/locales/utils';
import emitter from '@/plugins/emitter';
import { useInfiniteListStore } from '@/stores/InfiniteListStore';

const { t } = useI18n();
const { makeRequest } = useApi();
const message = useMessage();
const { addOne } = useInfiniteListStore();

const invitationFormModel = ref<OrganizationInvitation[]>([]);

const organizationFormRef = ref<FormInst | null>(null);
const organizationFormModel = ref<{
  title: string,
  description: string,
  visibility: OrganizationType
}>({ title: "", description: "", visibility: "PRIVATE" });
const organizationFormRules: FormRules = {
  title: [
    { required: true, message: tFormError(t, "title"), trigger: ["input", "blur"] },
  ],
  visibility: [
    { required: true, message: tFormError(t, "visibility"), trigger: ["input", "blur"] },
  ],
}
const validateOrganizationData = (nextStep: () => void) => {
  organizationFormRef.value?.validate((errors) => {
    if (errors) {
      console.error(errors);
      return;
    }

    nextStep();
  })
}

const handleOrganizationCreation = async () => {
  // Deduplicate invitations by username
  const normalizedInvitations = invitationFormModel.value.map((invitation) => {
    return { ...invitation, username: invitation.username.trim().replace('@', '') };
  });

  const uniqueUsernames: Set<string> = new Set();
  const uniqueInvitations: OrganizationInvitation[] = [];
  for (const invitation of normalizedInvitations) {
    if (!uniqueUsernames.has(invitation.username)) {
      uniqueUsernames.add(invitation.username);
      uniqueInvitations.push(invitation);
    }
  }

  const res = await makeRequest(() => createOrganization({
    title: organizationFormModel.value.title,
    description: organizationFormModel.value.description,
    type: organizationFormModel.value.visibility,
    invitations: uniqueInvitations,
  }))

  if (!res.ok) return;
  message.success(tEntityToastAction(t, "organization", "created"));

  emitter.emit("closeCreateEntityDialog");

  // All the mandatory data except for `createdAt` is known at this point
  // Id was returned by the server the rest is known locally
  // User is the owner of the organization at and has all the rights
  addOne<OrganizationWithRole>("organizations", {
    id: res.data.organizationId,
    title: organizationFormModel.value.title,
    description: organizationFormModel.value.description,
    type: organizationFormModel.value.visibility,
    createdAt: new Date().toUTCString(),
    stats: {
      members: 1,
      threads: 0
    },
    permissions: {
      update: true,
      delete: true,
      manageRoles: true,
      invite: true,
    },
    role: "ORG_OWNER"
  })
}

// TODO: Unhardcode
const organizationVisibilityOptions: { value: OrganizationType; label: string }[] = [
  "PRIVATE", "PUBLIC", "PERSONAL"
].map(
  (type) => ({
    value: type as OrganizationType, label: t(tScopePrefix("organization", `type.${type.toLowerCase()}`))
  })
);
</script>

<template>
  <EntityCreationDialogLayout scope-type="organization">
    <Step title="Details" :value="1" v-slot="{ nextStep }">
      <n-form ref="organizationFormRef" :model="organizationFormModel" :rules="organizationFormRules">
        <n-form-item :label="t('scopes.common.form-labels.title')" path="title">
          <n-input v-model:value="organizationFormModel.title" />
        </n-form-item>
        <n-form-item :label="t('scopes.common.form-labels.description')" path="description">
          <n-input v-model:value="organizationFormModel.description" type="textarea"/>
        </n-form-item>
        <n-form-item :label="t('scopes.common.form-labels.visibility')" path="visibility">
          <n-select v-model:value="organizationFormModel.visibility" :options="organizationVisibilityOptions" />
        </n-form-item>
      </n-form>
      <div class="flex flex-1 justify-end">
        <n-button @click="() => validateOrganizationData(nextStep!)">
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
            default-role="ORG_MEMBER"
            :placeholder="t('scopes.organization.no-invitations')"
          />
        </n-form-item>
      </n-form>
      <div class="flex flex-1 justify-between">
        <n-button @click="prevStep">
          <n-icon>
            <ArrowLeft />
          </n-icon>
        </n-button>
        <n-button @click="handleOrganizationCreation" type="info"> {{ t("actions.create") }} </n-button>
      </div>
    </Step>
  </EntityCreationDialogLayout>
</template>
