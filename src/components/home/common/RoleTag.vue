<script setup lang="ts">
import { NTag } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import type { AnyRole } from '@/api/common/AnyRole';
import { extractRoleFromString } from '@/locales/utils';
import type { ScopeType } from '@/types/scope';

defineProps<{
  scopeType: ScopeType
  role: AnyRole | null
}>();

const { t } = useI18n();
</script>

<template>
  <n-tag v-if="role" round :bordered="false" size="small">
    {{ t(extractRoleFromString(scopeType, role)) }}
  </n-tag>
</template>
