<script setup lang="ts">
import { Cog, UserFriends } from "@vicons/fa";
import { NButton, NTag } from "naive-ui";
import { useI18n } from "vue-i18n";
import type { ThreadWithRole } from "@/api/schemas/thread/common/Thread";
import type { ThreadStats } from "@/api/schemas/thread/common/ThreadStats";
import { extractRoleFromString } from "@/locales/utils";
import { hasAnyEditPermission } from "@/utils/permissions";
import EntityCard from "../common/EntityCard.vue";

const { t } = useI18n();

const props = defineProps<{
  entity: ThreadWithRole;
}>();
const emit = defineEmits<{
  edit: [id: number];
}>();

const calculateCompletionPercentage = (stats: ThreadStats): number => {
  if (stats.deadlines === 0) return 0;
  return Math.round((stats.completedDeadlines / stats.deadlines) * 100)
}
</script>

<template>
  <EntityCard>
    <template #header>
      <div class="flex w-full justify-between items-center">
        <div class="flex items-center space-x-3">
          <h3 class="overflow-x-auto whitespace-nowrap">{{ entity.title }}</h3>
          <n-tag v-if="entity.role" round :bordered="false" size="small">
            {{ t(extractRoleFromString('thread', entity.role)) }}
          </n-tag>
        </div>
        <div class="flex space-x-3">
          <n-button role="button" v-if="hasAnyEditPermission(entity.permissions)" @click.stop="emit('edit', entity.id)" text>
            <template #icon>
              <icon class="">
                <Cog/>
              </icon>
            </template>
          </n-button>
        </div>
      </div>
    </template>
     <template #body>
      <div class="width-full progress-bar mt-3 description">
        <div class="flex justify-between">
          <div>{{ t("scopes.thread.x-of-total-deadlines-done", {
            done: entity.stats.completedDeadlines,
            total: entity.stats.deadlines
          }) }}</div>
          <div>
            {{ calculateCompletionPercentage(entity.stats) }} %
          </div>
        </div>
        <!-- TODO: Use naive-ui colors -->
        <div class="w-full bg-blue-200 h-2 rounded-xl my-2 overflow-hidden">
          <div
            :style="{ width: `${calculateCompletionPercentage(entity.stats)}%` }"
            class="bg-blue-500 r-100 h-full transition-[width] ease-out duration-200"
          ></div>
        </div>
      </div>
    </template> 
    <template #footer>
      <div class="flex items-center">
        <icon class="mr-2" size="16">
          <UserFriends />
        </icon>
        {{ entity.stats.assignees }} {{ t('scopes.common.assignees').toLowerCase() }}
      </div>
    </template>
  </EntityCard>
</template>
