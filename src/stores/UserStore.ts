import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { User } from "@/api/schemas/common/User";
import type { Language } from "@/types/Language";

export const useUserStore = defineStore(
  "user",
  () => {
    const user = ref<User | null>(null);

    const isAvailable = computed(() => user.value !== null);

    function updateLanguage(language: Language) {
      if (!user.value) return;
      user.value.language = language;
    }

    function setUser(u: User) {
      user.value = u;
    }

    function $reset() {
      user.value = null;
    }

    return { user, isAvailable, setUser, updateLanguage, $reset };
  },
  {
    persist: {
      key: "user-store",
      storage: localStorage,
    },
  },
);
