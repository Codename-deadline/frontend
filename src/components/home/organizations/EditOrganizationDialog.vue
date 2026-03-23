<script setup lang="ts">
import { Envelope } from '@vicons/fa';
import { type FormInst, type FormRules, NButton, NForm, NFormItem, NIcon, NInput, NPopconfirm, NTabPane, useMessage } from 'naive-ui';
import { provide, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { deleteOrganization, getOrganizationMembers, inviteMemberToOrganization, patchOrganization, removeOrganizationMember } from '@/api/organization';
import { changeOrganizationMemberRole } from '@/api/roles';
import type { OrganizationWithRole } from '@/api/schemas/organization/common/Organization';
import type { OrganizationRole } from '@/api/schemas/organization/common/OrganizationRole';
import type { ChangeOrganizationRoleRequest } from '@/api/schemas/roles/requests/ChangeOrganizationRoleRequest';
import EntityDialoglayout from '@/components/home/common/dialogs/EntityDialoglayout.vue';
import MembersTab from '@/components/home/common/dialogs/members/MembersTab.vue';
import RoleDropdown from '@/components/home/common/forms/RoleDropdown.vue';
import UsernameInput from '@/components/home/common/forms/UsernameInput.vue';
import { useApi } from '@/composables/useApi';
import { DEFAULT_MEMBERS_PAGE_SIZE } from '@/constants/defaults';
import { PAGE_SIZE_KEY, SCOPE_TYPE_KEY } from '@/constants/providerKeys';
import { useInfiniteListStore } from '@/stores/InfiniteListStore';


const props = defineProps<{
  entity: OrganizationWithRole;
}>();
const emit = defineEmits<{
  close: []
}>();

const { makeRequest } = useApi();
const message = useMessage();
const { t } = useI18n();

const membersToLoad = DEFAULT_MEMBERS_PAGE_SIZE;
provide(PAGE_SIZE_KEY, membersToLoad);
provide(SCOPE_TYPE_KEY, "organization");

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
const handleOrganizationPatch = async (e: MouseEvent) => {
  e.preventDefault()
  patchFormRef.value?.validate(async (errors) => {
    console.error(errors);
    if (errors) return;

    const res = await makeRequest(() => patchOrganization(props.entity.id, patchFormModel.value))
    if (!res.ok) return;

    props.entity.title = patchFormModel.value.title;
    props.entity.description = patchFormModel.value.description;
    message.success(t("scopes.toasts.entity-updated", {
      entity: t("scopes.organization.name")
    }));
  })
}

const invitationFormRef = ref<FormInst | null>(null);
const invitationFormModel = ref<{
  usernameToInvite: string;
  role: OrganizationRole;
}>({
  role: "ORG_MEMBER",
  usernameToInvite: "",
});
const invitationFormRules: FormRules = {
  usernameToInvite: [
    { required: true, message: 'Username is required', trigger: ["input", "blur"] },
  ]
}
const handleInvitationSubmission = async (e: MouseEvent) => {
  e.preventDefault()
  invitationFormRef.value?.validate(async (errors) => {
    if (errors) {
      console.error(errors);
      return;
    }

    const res = await makeRequest(() => inviteMemberToOrganization(props.entity.id, {
      username: invitationFormModel.value.usernameToInvite.trim().replace('@', ''),
      role: invitationFormModel.value.role
    }))
    if (!res.ok) return;

    message.success(t("scopes.toasts.member-invited"));
    invitationFormModel.value.usernameToInvite = "";
  })
}
const handleOrganizationDelete = async (e: MouseEvent) => {
  e.preventDefault()

  const res = await makeRequest(() => deleteOrganization(props.entity.id))
  if (!res.ok) return;

  const infiniteListStore = useInfiniteListStore();
  infiniteListStore.removeItem<OrganizationWithRole>("organizations", props.entity.id);

  emit('close');
  message.success(t("scopes.toasts.entity-deleted", {
    entity: t("scopes.organization.name")
  }));
}

const handleLoadingMembers = (page: number) => {
  return getOrganizationMembers(props.entity.id, page, membersToLoad);
}
const handleMemberRoleUpdate = async (request: ChangeOrganizationRoleRequest) => {
  return changeOrganizationMemberRole(props.entity.id, request);
};
const handleMemberRemoval = async (username: string) => {
  --props.entity.stats.members;
  return removeOrganizationMember(props.entity.id, username);
};
</script>

<template>
  <EntityDialoglayout :title="entity.title" @close="emit('close')">
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
          />
        </n-form-item>
        <div class="grid grid-cols-3 px-4 mt-6">
          <n-popconfirm
            :disabled="!entity.permissions.delete"
            @positive-click="handleOrganizationDelete"
            class="rounded-lg!"
          >
            <template #trigger>
              <n-button :disabled="!entity.permissions.delete" class="rounded-lg!" type="error">{{ t('actions.delete') }}</n-button>
            </template>
            {{ t('actions.confirmation', {
              action: t('actions.to-confirm.delete-entity', {
                entity: t('scopes.organization.name').toLowerCase()
              })
            }) }}
          </n-popconfirm>
          <div></div>
          <n-button @click="handleOrganizationPatch" class="rounded-lg!" type="info">{{ t('actions.save') }}</n-button>
        </div>
      </n-form>
    </n-tab-pane>
    <n-tab-pane name="members" tab="Members">
      <MembersTab
        :fetcher="handleLoadingMembers"
        :update-member-role="handleMemberRoleUpdate"
        :remove-member="handleMemberRemoval"
        :members-stats="entity.stats.members"
        :can-manage-roles="entity.permissions.manageRoles"
        :my-role="entity.role"
      />
    </n-tab-pane>
    <n-tab-pane v-if="entity.permissions.invite" name="invites" :tab="t('scopes.common.form-sections.invitations')">
      <n-form ref="invitationFormRef" :model="invitationFormModel" :rules="invitationFormRules">
        <n-form-item :label="t('scopes.common.form-labels.username')" path="usernameToInvite">
          <div class="flex space-x-1! flex-1">
            <UsernameInput v-model="invitationFormModel.usernameToInvite" />
            <RoleDropdown
              @select="(role: OrganizationRole) => invitationFormModel.role = role"
              :button-role="invitationFormModel.role"
              :filter="(role) => !role.endsWith('OWNER')"
              size="medium"
            />
            <n-button @click="handleInvitationSubmission" class="rounded-lg!" type="info">
              <template #icon>
                <n-icon :size="14">
                  <Envelope />
                </n-icon>
              </template>
            </n-button>
          </div>
        </n-form-item>
      </n-form>
    </n-tab-pane>
  </EntityDialoglayout>
</template>
