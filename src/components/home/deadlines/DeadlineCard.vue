<script setup lang="ts">
import { CalendarAlt, Cog, UserFriends } from "@vicons/fa";
import { NButton, NTooltip } from "naive-ui";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import type { DeadlineWithRole } from "@/api/schemas/deadline/common/Deadline";
import { getPopoverTrigger } from "@/utils/flags";
import { hasAnyEditPermission } from "@/utils/permissions";
import EntityCard from "../common/EntityCard.vue";
import RoleTag from "../common/RoleTag.vue";

const { t } = useI18n();

const props = defineProps<{
  entity: DeadlineWithRole;
}>();
const emit = defineEmits<{
  edit: [id: number];
}>();

const dueDate = computed(() => new Date(props.entity.due));
const formattedDueDate = computed(() => {
  const tmp = dueDate.value;

  const short: string = `${tmp.getDate()}.${tmp.getMonth()}.${tmp.getFullYear()}`;
  return { short, long: `${tmp.getHours()}:${tmp.getMinutes()} ${short}` };
})
</script>

<template>
  <entity-card>
    <template #header>
      <div class="flex w-full justify-between items-center">
        <div class="flex items-center space-x-3">
          <h3 class="overflow-x-auto whitespace-nowrap">{{ entity.title }}</h3>
          <role-tag scope-type="deadline" :role="entity.role" />
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
    <template #footer>
      <div class="w-full flex justify-between items-center">
        <div class="flex items-center">
          <icon class="mr-2" size="16">
            <CalendarAlt />
          </icon>
          <n-tooltip placement="bottom" :trigger="getPopoverTrigger()">
            <template #trigger>
              <div class="cursor-help"> {{ formattedDueDate.short }} </div>
            </template>
            <span> {{ formattedDueDate.long }} </span>
          </n-tooltip>
        </div>
        <div class="flex items-center">
          <icon class="mr-2" size="16">
            <UserFriends />
          </icon>
          {{ entity.stats.assignees }} {{ t('scopes.common.assignees').toLowerCase() }}
        </div>
      </div>
    </template>
  </entity-card>
</template>
