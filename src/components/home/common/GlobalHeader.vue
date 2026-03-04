<script lang="ts" setup>
import { Language as LanguageIcon, User } from "@vicons/fa";
import { NButton, NDropdown, useThemeVars } from "naive-ui";
import type { DropdownMixedOption } from "naive-ui/es/dropdown/src/interface";
import { useI18n } from "vue-i18n";
import { APP_NAME } from "@/constants/app";
import { useUserStore } from "@/stores/UserStore";
import { Language } from "@/types/Language";

const { t } = useI18n();
const themeVars = useThemeVars();

const { updateLanguage } = useUserStore();

const languageOptions: DropdownMixedOption[] = [];
Object.values(Language).forEach((languageUpperCase: string) => {
  languageOptions.push({
    label: t(`language.${languageUpperCase.toLowerCase()}`),
    key: languageUpperCase,
  });
});
</script>

<template>
  <header class="w-full border-b">
    <div class="flex justify-between py-4 layout-dynamic-padding">
      <h1 class="text-2xl">{{ APP_NAME }}</h1>
      <div class="flex items-center space-x-4!">
        <n-dropdown trigger="click" placement="bottom" :options="languageOptions" @select="updateLanguage">
          <n-button text class="">
            <Icon size="32">
              <LanguageIcon/>
            </Icon>
          </n-button>
        </n-dropdown>
        <n-button text>
          <Icon size="20">
            <User/>
          </Icon>
        </n-button>
      </div>
    </div>
  </header>
</template>

<style scoped>
header {
  background-color: v-bind("themeVars.baseColor");
  border-color: v-bind("themeVars.borderColor");
}
</style>
