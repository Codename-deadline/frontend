import { defineStore } from "pinia";
import { ref } from "vue";
import type { PagedResponse } from "@/api/common/PaginationResponse";
import type { Organization } from "@/api/schemas/organization/common/Organization";
import type { OperationResult } from "@/types/OperationResult";

export type ListType = "organizations" | "threads" | "deadlines";

interface InfiniteListState<T> {
  items: T[];
  page: number;
  loading: boolean;
  hasMore: boolean;
}

export const useInfiniteListStore = defineStore("infiniteList", () => {
  // TODO: Add deadlines and threads to type union
  const stateMap = ref<Record<ListType, InfiniteListState<Organization>>>({
    organizations: { items: [], page: 0, loading: false, hasMore: true },
    threads: { items: [], page: 0, loading: false, hasMore: true },
    deadlines: { items: [], page: 0, loading: false, hasMore: true },
  });

  async function loadMore<T>(type: ListType, fetcher: (page: number) => Promise<OperationResult<PagedResponse<T>>>) {
    const state: InfiniteListState<T> = stateMap.value[type] as InfiniteListState<T>;

    if (state.loading || !state.hasMore) return;

    state.loading = true;

    try {
      const result = await fetcher(state.page);
      if (!result.ok) return;

      state.items.push(...result.data.data);

      if (state.page >= result.data.totalPages - 1) {
        state.hasMore = false;
      } else {
        state.page++;
      }
    } finally {
      state.loading = false;
    }
  }

  function reset(type: ListType) {
    stateMap.value[type] = { items: [], page: 1, loading: false, hasMore: true };
  }

  return { stateMap, loadMore, reset };
});
