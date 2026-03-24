<script setup lang="ts">
import { Cog, Globe, Lock, UserFriends, UserLock } from "@vicons/fa";
import { NButton, NIconWrapper, NTag } from "naive-ui";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import type { OrganizationWithRole } from "@/api/schemas/organization/common/Organization";
import { extractRoleFromString } from "@/locales/utils";
import EntityCard from "../common/EntityCard.vue";

const { t } = useI18n();

const props = defineProps<{
  entity: OrganizationWithRole;
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
        <n-icon-wrapper color="" :size="48" :border-radius="16">
          <Icon color="white" size="24">
            <UserFriends/>
          </Icon>
        </n-icon-wrapper>
        <div>
          <div class="flex space-x-3!">
            <n-button v-if="hasAnyEditPermission" @click="emit('edit', entity.id)" text>
              <template #icon>
                <icon>
                  <Cog/>
                </icon>
              </template>
            </n-button>
            <n-tag round :bordered="false" size="small">
              {{ t(extractRoleFromString('organization', entity.role)) }}
            </n-tag>
          </div>
        </div>
      </div>
      <div class="mt-3">
        <h3 class="overflow-x-auto whitespace-nowrap">{{ entity.title }}</h3>
        <div class="flex items-center description">
          <icon class="mr-2">
            <Globe v-if="entity.type === 'PUBLIC'" />
            <UserLock v-else-if="entity.type === 'PERSONAL'" />
            <Lock v-else />
          </icon>
          {{ t(`scopes.organization.type.${entity.type.toLowerCase()}`) }}
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex items-center">
        <icon class="mr-2" size="16">
          <UserFriends />
        </icon>
        {{entity.stats.members}} {{ t('scopes.common.members').toLowerCase() }}
      </div>
      <div>
        {{entity.stats.threads}} {{ t('scopes.thread.header').toLowerCase() }}
      </div>
    </template>
  </EntityCard>
</template>
