<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import NavBar from "@/components/home/common/NavBar.vue";
import type { MainSection } from "@/types/navigation";

const route = useRoute();
const router = useRouter();
const redirectToSection = (section: MainSection) => {
  router.push({ path: `/${section}` });
};
</script>

<template>
  <div class="w-screen absolute bottom-0">
    <nav-bar
      :default-section="route.path.split('/')[1] as MainSection"
      @section-selected="redirectToSection"
    />
  </div>
</template>
