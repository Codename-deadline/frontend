import { defineStore } from "pinia";
import { ref } from "vue";
import type { DeadlineWithRole } from "@/api/schemas/deadline/common/Deadline";
import type { OrganizationWithStatsAndRole } from "@/api/schemas/organization/common/Organization";
import type { ThreadWithRole } from "@/api/schemas/thread/common/Thread";
import type { ScopeType } from "@/types/scope";

type ScopeEntity =
  | { entity: OrganizationWithStatsAndRole; type: "organization" }
  | { entity: ThreadWithRole; type: "thread" }
  | { entity: DeadlineWithRole; type: "deadline" };

export const useCurrentScopeStore = defineStore("currentScope", () => {
  const organization = ref<OrganizationWithStatsAndRole | null>(null);
  const thread = ref<ThreadWithRole | null>(null);
  const deadline = ref<DeadlineWithRole | null>(null);

  function withScope(config: ScopeEntity) {
    switch (config.type) {
      case "organization":
        organization.value = config.entity;
        thread.value = null;
        deadline.value = null;
        break;
      case "thread":
        thread.value = config.entity;
        deadline.value = null;
        break;
      case "deadline":
        deadline.value = config.entity;
        break;
    }
  }

  function exitScope(scopeType: ScopeType) {
    switch (scopeType) {
      case "organization":
        organization.value = null;
        thread.value = null;
        deadline.value = null;
        break;
      case "thread":
        thread.value = null;
        deadline.value = null;
        break;
      case "deadline":
        deadline.value = null;
        break;
    }
  }

  function exitAndSet(config: ScopeEntity) {
    exitScope(config.type);
    withScope(config);
  }

  function $reset() {
    exitScope("organization");
  }

  return {
    organization,
    thread,
    deadline,
    withScope,
    exitScope,
    exitAndSet,
    $reset,
  };
});
