<script setup lang="ts">
import SignInForm from "@/components/auth/sign-in/SignInForm.vue";
import SignUpForm from "@/components/auth/sign-up/SignUpForm.vue";

const props = defineProps({
  method: String,
  isSignIn: Boolean,
});
</script>

<template>
  <SignInForm v-if="isSignIn" :method="method" />
  <SignUpForm v-else :method="method" />
</template>
