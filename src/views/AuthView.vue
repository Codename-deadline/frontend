<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import AuthForm from "@/components/auth/AuthForm.vue";
import AuthSelection from "@/components/auth/AuthSelection.vue";
import emitter from "@/plugins/emitter";
import { useUserStore } from "@/stores/UserStore";
import type { AuthMethod } from "@/types/api";

const selectedMethod = ref<AuthMethod>();
const isSignInSelected = ref<boolean>(true);

emitter.on("resetAuthProgress", () => {
  selectedMethod.value = undefined;
});

const _handleMethodSelected = (method: AuthMethod, isSignIn: boolean) => {
  selectedMethod.value = method;
  isSignInSelected.value = isSignIn;
};

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
if (route.path.includes("auth") && userStore.isAvailable) {
  router.push({ path: "/" });
}
</script>

<template>
  <div class="w-full h-lvh flex items-center justify-center">
    <AuthSelection v-if="!selectedMethod" @method-selected="_handleMethodSelected"/>
    <AuthForm v-else :method="selectedMethod" :isSignIn="isSignInSelected"/>
  </div>
</template>
