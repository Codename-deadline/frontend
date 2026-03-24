<script setup lang="ts">
import { TrashAlt } from '@vicons/fa';
import { NAvatar, NButton, NPagination, NPopconfirm, NSkeleton, useThemeVars } from 'naive-ui';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { MemberWithRole } from '@/api/schemas/common/Member';
import type { User } from '@/api/schemas/common/User';
import type { RolesMetadata } from '@/api/schemas/roles/metadata';
import RoleDropdown from '@/components/home/common/forms/RoleDropdown.vue';
import { PAGE_SIZE_KEY, USER_KEY } from '@/constants/providerKeys';
import { tActionConfirmation } from '@/locales/utils';
import { useMetadataStore } from '@/stores/MetadataStore';
import type { AnyRole, ScopeType } from '@/types/scope';
import { injectOrThrow } from '@/utils';

const props = defineProps<{
  members: MemberWithRole[];
  totalPages: number;
  canManageRoles: boolean;
  myRole: AnyRole;
}>();
const emit = defineEmits<{
  loadMore: [page: number],
  updateRole: [member: MemberWithRole, newRole: AnyRole],
  removeMember: [member: MemberWithRole]
}>();
const { t } = useI18n();
const themeVars = useThemeVars();

const pageSize = injectOrThrow<number>(PAGE_SIZE_KEY);
const user = injectOrThrow<User>(USER_KEY);

// IMPORTANT: UI pages are 1-indexed, but api pages are 0-indexed
const currentPage = ref<number>(1);
watch(currentPage, (value) => {
  if (value > props.totalPages) return;
  // Members are loaded in batches, the page cannot be partially loaded
  // Therefore, if at least one member of the page is already loaded, we conclude that there are no more
  if (props.members.length > pageSize * (value - 1)) return;
  emit('loadMore', value - 1);
})

const membersToRender = computed<MemberWithRole[]>(
  () => props.members.slice((currentPage.value - 1) * pageSize, (currentPage.value) * pageSize)
);
const placeholdersToRender = computed<number>(() => pageSize - membersToRender.value.length);
const isLoading = computed<boolean>(() => membersToRender.value.length === 0);

const metadataStore = useMetadataStore();
const rolesMetadata: RolesMetadata | undefined = metadataStore.metadata.roles?.value;
if (!rolesMetadata) {
  throw new Error("MemberManager: Unable to retrieve roles metadata");
}

const userRoleIdx: number = rolesMetadata.roles.indexOf(props.myRole);
const canUserAssignY = (roleX: AnyRole, _: ScopeType) => {
  const xIdx: number = rolesMetadata.roles.indexOf(roleX);
  // It is guaranteed that the matrix contains all roles and is quadratic NxN.
  return rolesMetadata.matrix[userRoleIdx]![xIdx];
}
const isMe = (member: MemberWithRole) => member.user.id === user.id;

const getAvatarText = (fullname: string) => {
  return fullname.split(' ').map((n) => n.charAt(0).toUpperCase()).join('');
};
</script>

<template>
  <div class="mt-2 space-y-2">
    <div
      v-for="member in membersToRender" :key="member.user.id"
      class="flex items-center member-border rounded-lg p-2 space-x-3"
    >
      <n-avatar round>{{ getAvatarText(member.user.fullName) }}</n-avatar>
      <div class="flex flex-1 justify-between items-center">
        <div class="flex flex-col">
          <span>{{ member.user.fullName }}</span>
          <span class="text-sm description">@{{ member.user.username }}</span>
        </div>
        <div class="flex items-center space-x-2!">
          <RoleDropdown
            @select="(role) => emit('updateRole', member, role)"
            :button-role="member.role"
            :filter="canUserAssignY"
            :disabled="!canManageRoles || isMe(member)"
          />
          <n-popconfirm
            v-if="canManageRoles"
            @positive-click="() => emit('removeMember', member)"
            class="rounded-lg!"
          >
            <template #trigger>
              <n-button v-show="!isMe(member)" class="rounded-lg!" size="small" type="error" ghost>
                <template #icon>
                  <Icon :size="16">
                    <TrashAlt />
                  </Icon>
                </template>
              </n-button>
            </template>
            {{ tActionConfirmation(t, 'remove-member') }}
          </n-popconfirm>
        </div>
      </div>
    </div>
    <div v-for="i in placeholdersToRender" :key="i" class="min-w-75 h-[60.4px]">
      <n-skeleton v-if="isLoading" height="100%" width="100%" :sharp="false" />
    </div>
  </div>
  <div class="flex justify-center">
    <n-pagination class="mt-3" v-model:page="currentPage" :page-count="totalPages" />
  </div>
</template>

<style lang="css" scoped>
.member-border {
  border-width: 1px;
  border-color: v-bind('themeVars.borderColor');
}
</style>
