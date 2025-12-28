<script setup lang="ts">
import { ClockRegular, Envelope, Tasks, Users } from "@vicons/fa";
import { useThemeVars } from "naive-ui";
import { ref } from "vue";
import { MainSection, type NavigationButtonConfig } from "@/types/navigation";
import NavButton from "./NavButton.vue";

const props = withDefaults(
  defineProps<{
    defaultSection?: MainSection;
  }>(),
  {
    defaultSection: MainSection.ORGANIZATIONS,
  },
);
const emit = defineEmits<(e: "section-selected", section: MainSection) => void>();

const buttons: NavigationButtonConfig[] = [
  {
    section: MainSection.ORGANIZATIONS,
    icon: Users,
  },
  {
    section: MainSection.THREADS,
    icon: Tasks,
  },
  {
    section: MainSection.DEADLINES,
    icon: ClockRegular,
  },
  {
    section: MainSection.INVITATIONS,
    icon: Envelope,
  },
];
const themeVars = useThemeVars();
const currentSection = ref<MainSection>(props.defaultSection);

const updateCurrentSection = (section: MainSection) => {
  currentSection.value = section;
  emit("section-selected", section);
};
</script>

<template>
  <nav class="w-full border-t flex justify-center py-2">
    <div class="w-full gap-2 sm:w-3/4 sm:gap-4 md:w-1/2 md:gap-6 xl:gap-8 inline-grid grid-flow-col auto-cols-fr">
      <nav-button
        @click="updateCurrentSection"
        v-for="button in buttons"
        :key="button.section"
        :text-selector="`navigation.buttons.${button.section.toLowerCase()}`"
        :icon="button.icon"
        :section="button.section"
        :is-active="currentSection === button.section"
      />
    </div>
  </nav>
</template>

<style scoped>
nav {
  background-color: v-bind('themeVars.baseColor');
  border-color: v-bind('themeVars.borderColor');
}
</style>
