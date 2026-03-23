<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core';
import type { MentionOption } from 'naive-ui';
import { NMention } from 'naive-ui';
import { ref } from 'vue';
import { getUsersWithUsernameStartingWith } from '@/api/user';
import { useApi } from '@/composables/useApi';

const { makeRequest } = useApi();

const options = ref<MentionOption[]>([]);
const loading = ref<boolean>(false);
const username = defineModel<string>();

const fetchUsers = async (value: string) => {
  if (value.length < 2) {
    options.value = [];
    return;
  }

  loading.value = true;
  const res = await makeRequest(() => getUsersWithUsernameStartingWith(value));
  loading.value = false;

  if (!res.ok) {
    options.value = [];
    return;
  }

  options.value = res.data.map((username) => ({ label: username, value: username }));
};

const handleSearch = useDebounceFn(fetchUsers, 250);
</script>

<template>
  <n-mention
    v-model:value="username"
    @search="handleSearch"
    :options="options"
    :loading="loading"
    default-value="@"
    placeholder="@username"
  />
</template>
