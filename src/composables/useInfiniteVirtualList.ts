import { useInfiniteScroll, useVirtualList } from "@vueuse/core";
import { computed, type ComputedRef } from "vue";
import type { PagedResponse } from "@/api/common/PaginationResponse";
import { type ListType, useInfiniteListStore } from "@/stores/InfiniteListStore";
import type { SafeApiCall } from "@/types/api";
import { displayApiError, displayFormErrors } from "@/utils";
import { useApi } from "./useApi";

export function useInfiniteVirtualList<T>(
  type: ListType,
  fetcher: (page: number) => Promise<SafeApiCall<PagedResponse<T>>>,
  options: {
    itemsPerRow: ComputedRef<number>;
    itemHeight: number;
    distance?: number;
  },
) {
  const { makeRequest } = useApi();
  const store = useInfiniteListStore();
  const distance = options.distance ?? 200;

  const fetcherClosure = async (page: number) => {
    return await makeRequest(() => fetcher(page), displayFormErrors, displayApiError);
  };

  if (!store.stateMap[type].items.length) {
    store.loadMore<T>(type, fetcherClosure);
  }

  const items = computed<T[]>(() => store.stateMap[type].items as T[]);
  const rows = computed(() => {
    const result: T[][] = []
    for (let i = 0; i < items.value.length; i += options.itemsPerRow.value) {
      result.push(items.value.slice(i, i + options.itemsPerRow.value))
    }
    return result
  })

  const virtual = useVirtualList(rows, {
    itemHeight: options.itemHeight,
  })

  useInfiniteScroll(
    virtual.containerProps.ref,
    () => store.loadMore<T>(type, fetcherClosure),
    { distance }
  )

  return {
    containerProps: virtual.containerProps,
    wrapperProps: virtual.wrapperProps,
    virtualItems: virtual.list,
    scrollTo: virtual.scrollTo,

    loading: computed(() => store.stateMap[type].loading),
    hasMore: computed(() => store.stateMap[type].hasMore),

    loadMore: () => store.loadMore<T>(type, fetcherClosure),
    reset: () => store.reset(type),
  }
}
