<script setup lang="ts">
import { NAvatar, NButton, NDropdown, NPagination } from 'naive-ui';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { MemberWithRole } from '@/api/schemas/common/Member';
import type { RolesMetadata } from '@/api/schemas/roles/metadata';
import { extractRoleFromString } from '@/locales/utils';
import { useMetadataStore } from '@/stores/MetadataStore';
import type { AnyRole, ScopeType } from '@/types/scope';

const props = defineProps<{
  members: MemberWithRole[];
  pageSize: number;
  totalPages: number;
  canManageRoles: boolean;
  myRole: AnyRole;
  roleScope: ScopeType;
}>();
const emit = defineEmits<{
  loadMore: [page: number]
}>();
const { t } = useI18n();

// IMPORTANT: UI pages are 1-indexed, but api pages are 0-indexed
const currentPage = ref<number>(1);
watch(currentPage, (value) => {
  if (value > props.totalPages) return;
  // Members are loaded in batches, the page cannot be partially loaded
  // Therefore, if at least one member of the page is already loaded, we conclude that there are no more
  if (props.members.length > props.pageSize * (value - 1)) return;
  emit('loadMore', value - 1);
})
const membersToRender = computed(
  () => props.members.slice((currentPage.value - 1) * props.pageSize, (currentPage.value) * props.pageSize)
);

const metadataStore = useMetadataStore();
const rolesMetadata: RolesMetadata | undefined = metadataStore.metadata.roles?.value;
if (!rolesMetadata) {
  throw new Error("MemberManager: Unable to retrieve roles metadata");
}

const userRoleIdx: number = rolesMetadata.roles.indexOf(props.myRole);
const getRoleOptions = (memberRole: AnyRole) => {
  const buildLabel = (role: AnyRole) => t(extractRoleFromString(props.roleScope, role));
  const canUserAssignY = (roleX: AnyRole) => {
    const xIdx: number = rolesMetadata.roles.indexOf(roleX);
    // It is guaranteed that the matrix contains all roles and is quadratic NxN.
    return rolesMetadata.matrix[userRoleIdx]![xIdx];
  }

  const roleOptions: { label: string; value: string }[] = [{
    label: buildLabel(memberRole), value: memberRole
  }];
  // If one cannot assign role X it means that the current role is <= X
  // Therefore no actions are available
  if (!canUserAssignY(memberRole)) {
    return roleOptions;
  }

  for (let i = 0; i < rolesMetadata.roles.length; ++i) {
    const currentRole: AnyRole = rolesMetadata.roles[i]!;
    if (rolesMetadata.matrix[userRoleIdx]![i] && currentRole !== memberRole) {
      roleOptions.push({ label: buildLabel(currentRole), value: currentRole });
    }
  }
  return roleOptions;
}

const getAvatarText = (fullname: string) => {
  return fullname.split(' ').map((n) => n.charAt(0).toUpperCase()).join('');
};
</script>

<template>
  <div class="max-h-1/3 mt-1 overflow-y-auto">
    <div
      v-for="member in membersToRender"
      :key="member.user.id"
      class="flex items-center border rounded-lg p-2 space-x-3"
    >
      <n-avatar round>{{ getAvatarText(member.user.fullName) }}</n-avatar>
      <div class="flex flex-1 justify-between items-center">
        <div class="flex flex-col">
          <span>{{ member.user.fullName }}</span>
          <span class="text-sm description">@{{ member.user.username }}</span>
        </div>
        <n-dropdown trigger="click" :options="getRoleOptions(member.role)">
          <n-button :disabled="!canManageRoles" class="rounded-lg! capitalize" size="small">
            {{ t(extractRoleFromString(roleScope, member.role)) }}
          </n-button>
        </n-dropdown>
      </div>
    </div>
    <div class="flex justify-center">
      <n-pagination class="mt-3" v-model:page="currentPage" :page-count="totalPages" />
    </div>
  </div>
</template>
