<script setup lang="ts">
import { TrashAlt } from '@vicons/fa';
import { NAvatar, NButton, NDropdown, NPagination, NPopconfirm, useThemeVars } from 'naive-ui';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { MemberWithRole } from '@/api/schemas/common/Member';
import type { RolesMetadata } from '@/api/schemas/roles/metadata';
import { extractRoleFromString } from '@/locales/utils';
import { useMetadataStore } from '@/stores/MetadataStore';
import type { AnyRole, ScopeType } from '@/types/scope';
import { isRoleInScope } from '@/utils';

const props = defineProps<{
  members: MemberWithRole[];
  pageSize: number;
  totalPages: number;
  canManageRoles: boolean;
  myRole: AnyRole;
  scopeType: ScopeType;
}>();
const emit = defineEmits<{
  loadMore: [page: number],
  updateRole: [member: MemberWithRole, newRole: AnyRole],
  removeMember: [member: MemberWithRole]
}>();
const { t } = useI18n();
const themeVars = useThemeVars();

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
  const buildLabel = (role: AnyRole) => t(extractRoleFromString(props.scopeType, role));
  const canUserAssignY = (roleX: AnyRole) => {
    const xIdx: number = rolesMetadata.roles.indexOf(roleX);
    // It is guaranteed that the matrix contains all roles and is quadratic NxN.
    return rolesMetadata.matrix[userRoleIdx]![xIdx];
  }

  const roleOptions: { label: string; key: string }[] = [{
    label: buildLabel(memberRole), key: memberRole
  }];
  // If one cannot assign role X it means that the current role is <= X
  // Therefore no actions are available
  if (!canUserAssignY(memberRole)) {
    return roleOptions;
  }

  for (let i = 0; i < rolesMetadata.roles.length; ++i) {
    const currentRole: AnyRole = rolesMetadata.roles[i]!;
    if (!isRoleInScope(currentRole, props.scopeType)) continue;

    if (rolesMetadata.matrix[userRoleIdx]![i] && currentRole !== memberRole) {
      roleOptions.push({ label: buildLabel(currentRole), key: currentRole });
    }
  }
  return roleOptions;
}

const getAvatarText = (fullname: string) => {
  return fullname.split(' ').map((n) => n.charAt(0).toUpperCase()).join('');
};
</script>

<template>
  <div class="max-h-1/3 mt-2 space-y-2">
    <div
      v-for="member in membersToRender"
      :key="member.user.id"
      class="flex items-center member-border rounded-lg p-2 space-x-3"
    >
      <n-avatar round>{{ getAvatarText(member.user.fullName) }}</n-avatar>
      <div class="flex flex-1 justify-between items-center">
        <div class="flex flex-col">
          <span>{{ member.user.fullName }}</span>
          <span class="text-sm description">@{{ member.user.username }}</span>
        </div>
        <div class="flex items-center space-x-2!">
          <n-dropdown
            @select="(newRole: AnyRole) => emit('updateRole', member, newRole)"
            :options="getRoleOptions(member.role)"
            trigger="click"
          >
            <n-button :disabled="!canManageRoles" class="rounded-lg! capitalize" size="small">
              {{ t(extractRoleFromString(scopeType, member.role)) }}
            </n-button>
          </n-dropdown>
          <n-popconfirm
            v-if="canManageRoles"
            @positive-click="() => emit('removeMember', member)"
            class="rounded-lg!"
          >
            <template #trigger>
              <n-button class="rounded-lg!" size="small" type="error" ghost>
                <template #icon>
                  <Icon :size="16">
                    <TrashAlt />
                  </Icon>
                </template>
              </n-button>
            </template>
            {{ t('actions.confirmation', { action: t('actions.to-confirm.remove-member') }) }}
          </n-popconfirm>
        </div>
      </div>
    </div>
    <div class="flex justify-center">
      <n-pagination class="mt-3" v-model:page="currentPage" :page-count="totalPages" />
    </div>
  </div>
</template>

<style lang="css" scoped>
.member-border {
  border-width: 1px;
  border-color: v-bind('themeVars.borderColor');
}
</style>
