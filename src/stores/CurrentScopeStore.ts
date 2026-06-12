import { defineStore } from "pinia";
import { ref } from "vue";
import type { ScopeType } from "@/types/scope";

export const useCurrentScopeStore = defineStore("currentScope", () => {
  const orgId = ref<number | null>(null);
  const thrId = ref<number | null>(null);
  const ddlId = ref<number | null>(null);

  function withScope(id: number, scopeType: ScopeType) {
    if (id < 0) {
      console.error(`Invalid id (${id}) passed for scope type '${scopeType}'`);
      $reset();
      return;
    }

    switch (scopeType) {
      case "organization":
        orgId.value = id;
        break;
      case "thread":
        thrId.value = id;
        break;
      case "deadline":
        ddlId.value = id;
        break;
    }
  }

  function exitScope(scopeType: ScopeType) {
    // Fallthrough would fit here, but the sheer amount of "ignore" comments for
    // biome + ts is not worth it
    switch (scopeType) {
      case "organization":
        orgId.value = null;
        thrId.value = null;
        ddlId.value = null;
        break;
      case "thread":
        thrId.value = null;
        ddlId.value = null;
        break;
      case "deadline":
        ddlId.value = null;
        break;
    }
  }

  function exitAndUpdate(id: number, scopeType: ScopeType) {
    exitScope(scopeType);
    withScope(id, scopeType);
  }

  function $reset() {
    exitScope("organization");
  }

  return { orgId, thrId, ddlId, withScope, exitScope, exitAndUpdate, $reset };
});
