<script setup lang="ts">
import type { OrganizationWithRole } from "@/api/schemas/organization/common/Organization";
import { tScopePrefix, extractRoleFromString } from "@/locales/utils";
import { Cog, Globe, Lock, UserFriends, UserLock } from "@vicons/fa";
import { NButton, NCard, NDivider, NIconWrapper, NTag } from "naive-ui";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{
  organization: OrganizationWithRole;
}>();
const emit = defineEmits<{
  edit: [id: number]
}>();

// TODO: Extract
const hasAnyEditPermission = computed<boolean>(
  () => Object.values(props.organization.permissions).reduce(
    (accumulator: boolean, curValue: boolean) => accumulator ||= curValue,
    false
  )
);
</script>

<template>
  <n-card class="rounded-xl! shadow-sm hover:shadow-lg hover:cursor-pointer">
    <header>
      <div class="flex w-full justify-between">
        <n-icon-wrapper color="" :size="48" :border-radius="16">
          <Icon color="white" size="24">
            <UserFriends/>
          </Icon>
        </n-icon-wrapper>
        <div>
          <div class="flex space-x-3!">
            <n-button v-if="hasAnyEditPermission" @click="emit('edit', organization.id)" text>
              <template #icon>
                <icon>
                  <Cog/>
                </icon>
              </template>
            </n-button>
            <n-tag round :bordered="false" size="small">
              {{ t(extractRoleFromString('organization', organization.role)) }}
            </n-tag>
          </div>
        </div>
      </div>
      <div class="mt-3">
        <h3>{{ organization.title }}</h3>
        <div class="flex items-center description">
          <icon class="mr-2">
            <Globe v-if="organization.type === 'PUBLIC'" />
            <UserLock v-else-if="organization.type === 'PERSONAL'" />
            <Lock v-else />
          </icon>
          {{ t(tScopePrefix("organization", `type.${organization.type.toLowerCase()}`)) }}
        </div>
      </div>
    </header>
    <n-divider class="my-3!" />
    <footer class="flex space-x-3 description">
      <div class="flex items-center">
        <icon class="mr-2" size="16">
          <UserFriends />
        </icon>
        {{organization.stats.members}} {{ t('scopes.common.members') }}
      </div>
      <div>
        {{organization.stats.threads}} {{ t(tScopePrefix("thread", "header")).toLowerCase() }}
      </div>
    </footer>
  </n-card>
</template>
