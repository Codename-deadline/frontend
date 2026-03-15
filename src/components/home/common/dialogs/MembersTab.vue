<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { PagedResponse } from '@/api/common/PaginationResponse';
import type { MemberWithRole } from '@/api/schemas/common/Member';
import MemberManager from '@/components/home/common/dialogs/MemberManager.vue';
import { useApi } from '@/composables/useApi';
import type { SafeApiCall } from '@/types/api';
import type { AnyRole } from '@/types/scope';
import { displayApiError, displayFormErrors } from '@/utils';

const props = defineProps<{
  fetcher: (page: number) => Promise<SafeApiCall<PagedResponse<MemberWithRole>>>;
  membersStats: number;
  canManageRoles: boolean;
  myRole: AnyRole;
}>();

const members = ref<MemberWithRole[]>([]);
const totalPages = ref<number>(1);

const { makeRequest } = useApi();
const loadMembers = async (page: number) => {
  const res = await makeRequest(() => props.fetcher(page), displayFormErrors, displayApiError);
  if (!res.ok) return;
  members.value = members.value.concat(res.data.data);
  totalPages.value = res.data.totalPages;
};

onMounted(async () => {
  await loadMembers(0);
})
</script>

<template>
  <div>
    <div>Members ({{ membersStats }})</div>
    <member-manager
      @loadMore="loadMembers"
      :members="members"
      :page-size="10"
      :total-pages="totalPages"
      :can-manage-roles="canManageRoles"
      :my-role="myRole"
      role-scope="organization"
    />
  </div>
</template>
