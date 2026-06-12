<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import NavBar from "@/components/home/common/NavBar.vue";
import { useCurrentScopeStore } from "@/stores/CurrentScopeStore";
import { MainSection } from "@/types/navigation";

const route = useRoute();
const router = useRouter();
const currentScopeStore = useCurrentScopeStore();

const redirectToSection = (section: MainSection) => {
  // Invalidate current context
  // As the general "section" button was pressed, therefore
  // removing an entity selection if it was present
  switch (section) {
    case MainSection.ORGANIZATIONS:
      currentScopeStore.exitScope("organization");
      break;
    case MainSection.THREADS:
      currentScopeStore.exitScope("thread");
      break;
    case MainSection.DEADLINES:
      currentScopeStore.exitScope("deadline");
      break;
    default:
      break;
  }
  
  router.push({ path: `/${section}` });
};
</script>

<template>
  <div class="w-screen fixed bottom-0">
    <nav-bar :default-section="route.path.split('/')[1] as MainSection" @section-selected="redirectToSection"/>
  </div>
</template>
