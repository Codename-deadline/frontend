<script setup lang="ts">
import { Cog, Globe, Lock, UserFriends } from "@vicons/fa";
import { NButton, NCard, NDivider, NIconWrapper, NTag } from "naive-ui";
import { useI18n } from "vue-i18n";
import type { OrganizationType } from "@/api/schemas/organization/common/OrganizationType";

const { t } = useI18n();

const props = defineProps<{
  title: string;
  scope: OrganizationType;
  role: string;
}>();
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

        <div >
          <div class="flex space-x-3!">
            <n-button text>
              <template #icon>
                <icon>
                  <Cog/>
                </icon>
              </template>
            </n-button>
            <n-tag round :bordered="false" size="small">{{ t(`organization.role.${role.toLowerCase()}`) }}</n-tag>
          </div>

        </div>
      </div>
      <div class="mt-3">
        <h3>{{ title }}</h3>
        <div class="flex items-center description">
          <icon class="mr-2">
            <Globe v-if="scope === 'PUBLIC'" />
            <Lock v-else />
          </icon>
          {{ t(`organization.scope.${scope.toLowerCase()}`) }}
        </div>
      </div>
    </header>
    <n-divider class="my-3!" />
    <footer class="flex space-x-3 description">
      <div class="flex items-center">
        <icon class="mr-2" size="16">
          <UserFriends />
        </icon>
        8 members
      </div>
      <div>
        3 threads
      </div>
    </footer>
  </n-card>
</template>
