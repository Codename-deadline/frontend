<script setup lang="ts">
// biome-ignore lint/correctness/noUnusedImports: Biome does not yet check <template>
import { NButton, NForm } from "naive-ui";
import { useI18n } from "vue-i18n";
import emitter from "@/plugins/emitter";

const { t } = useI18n();

const emit = defineEmits({
  submit: () => true,
});

const props = defineProps<{
  isSignIn: boolean;
}>();
let translationSelector = `${props.isSignIn ? "sign-in" : "sign-up"}`;
translationSelector = `auth.${translationSelector}.${translationSelector}`;

const _resetAuthProcess = () => {
  emitter.emit("resetAuthProgress");
};
</script>

<template>
  <n-form>
    <slot/>
    <div class="flex justify-around">
      <n-button type="primary" @click="_resetAuthProcess">{{ t('back') }}</n-button>
      <n-button type="primary" @click="emit('submit')">{{ t(translationSelector) }}</n-button>
    </div>
  </n-form>
</template>
