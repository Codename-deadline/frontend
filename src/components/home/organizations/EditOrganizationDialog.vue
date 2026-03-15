<script setup lang="ts">
import { Envelope } from '@vicons/fa';
import { type FormInst, type FormRules, NButton, NForm, NFormItem, NIcon, NInput, NTabPane } from 'naive-ui';
import { ref } from 'vue';
import { getMembers, patch } from '@/api/organization';
import type { OrganizationWithRole } from '@/api/schemas/organization/common/Organization';
import EntityDialoglayout from '@/components/home/common/dialogs/EntityDialoglayout.vue';
import MembersTab from '@/components/home/common/dialogs/MembersTab.vue';
import { useApi } from '@/composables/useApi';

const props = defineProps<{
  entity: OrganizationWithRole;
}>();
const emit = defineEmits<{
  close: []
}>();

const formRef = ref<FormInst | null>(null);
const model = ref<{
  title: string;
  description: string | undefined;
}>({
  title: props.entity.title,
  description: props.entity.description,
});
const rules: FormRules = {
  title: [
    { required: true, message: 'Title is required', trigger: ["input", "blur"] },
  ],
  description: [
    { required: false },
  ],
}

const { makeRequest } = useApi();
const patchOrganization = async (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    console.log(errors);
    if (errors) return;

    const res = await makeRequest(() => patch(props.entity.id, model.value))
    if (res.ok) {
      props.entity.title = model.value.title;
      props.entity.description = model.value.description;
    }
  })
}

const inviteUsername = ref<string>('');

const loadMembers = (page: number) => {
  return getMembers(props.entity.id, page);
}
</script>

<template>
  <EntityDialoglayout :title="entity.title" @close="emit('close')">
    <n-tab-pane name="settings" tab="Settings">
      <n-form ref="formRef" :model="model" :rules="rules">
        <n-form-item label="Title" path="title">
          <n-input
            :disabled="!entity.permissions.update"
            class="rounded-lg!"
            v-model:value="model.title"
          />
        </n-form-item>
        <n-form-item label="Description" path="description">
          <n-input
            :disabled="!entity.permissions.update"
            class="rounded-lg!"
            v-model:value="model.description"
          />
        </n-form-item>
        <div class="grid grid-cols-3 px-4 mt-6">
          <n-button :disabled="!entity.permissions.delete" class="rounded-lg!" type="error">Delete</n-button>
          <div></div>
          <n-button @click="patchOrganization" class="rounded-lg!" type="info">Save changes</n-button>
        </div>
      </n-form>
    </n-tab-pane>
    <n-tab-pane name="members" tab="Members">
      <MembersTab
        :fetcher="loadMembers"
        :members-stats="entity.stats.members"
        :can-manage-roles="entity.permissions.manageRoles"
        :my-role="entity.role"
      />
    </n-tab-pane>
    <n-tab-pane name="invites" tab="Invites">
      <div>
        <label for="org-invite">Invite to organization</label>
        <div class="flex space-x-2">
          <n-input class="rounded-lg!" id="org-invite" v-model:value="inviteUsername" />
          <n-button class="rounded-lg!" type="info">
            <template #icon>
              <n-icon :size="14">
                <Envelope />
              </n-icon>
            </template>
            Invite
          </n-button>
        </div>
      </div>
    </n-tab-pane>
  </EntityDialoglayout>
</template>
