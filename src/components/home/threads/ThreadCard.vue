<script setup lang="ts">
import { Cog, UserFriends } from "@vicons/fa";
import { NButton, NTag } from "naive-ui";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import type { ThreadWithRole } from "@/api/schemas/thread/common/Thread";
import { extractRoleFromString } from "@/locales/utils";
import EntityCard from "../common/EntityCard.vue";

const { t } = useI18n();

const props = defineProps<{
  entity: ThreadWithRole;
}>();
const emit = defineEmits<{
  edit: [id: number];
}>();

// TODO: Extract
const hasAnyEditPermission = computed<boolean>(() =>
  Object.values(props.entity.permissions).reduce(
    (accumulator: boolean, curValue: boolean) => (accumulator ||= curValue),
    false,
  ),
);
</script>

<template>
  <EntityCard>
    <template #header>
      <div class="flex w-full justify-between">
        <div class="flex space-x-3!">
          <n-button v-if="hasAnyEditPermission" @click="emit('edit', entity.id)" text>
            <template #icon>
              <icon>
                <Cog/>
              </icon>
            </template>
          </n-button>
          <n-tag v-if="entity.role" round :bordered="false" size="small">
            {{ t(extractRoleFromString('thread', entity.role)) }}
          </n-tag>
        </div>
        <div class="mt-3">
          <h3 class="overflow-x-auto whitespace-nowrap">{{ entity.title }}</h3>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex items-center">
        <icon class="mr-2" size="16">
          <UserFriends />
        </icon>
        {{entity.stats.assignees}} {{ t('scopes.common.assignees').toLowerCase() }}
      </div>
      <div>
        {{entity.stats.deadlines}} {{ t('scopes.deadline.header').toLowerCase() }}
      </div>
    </template>
  </EntityCard>
</template>
