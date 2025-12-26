<script setup lang="ts">
import SignInForm from "@/components/auth/sign-in/SignInForm.vue";
import SignUpForm from "@/components/auth/sign-up/SignUpForm.vue";
import type { AuthMethod } from "@/types/api";

const props = defineProps<{
  method: AuthMethod;
  isSignIn: boolean;
}>();
</script>

<template>
  <SignInForm v-if="isSignIn" :method="method" />
  <SignUpForm v-else :method="method" />
</template>
