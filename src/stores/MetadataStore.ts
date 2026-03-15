import { defineStore } from "pinia";
import { ref } from "vue";
import type { RolesMetadata } from "@/api/schemas/roles/metadata";

type MetadataWithVersion<T> = {
  value: T;
  version: string;
};

export const useMetadataStore = defineStore(
  "metadata",
  () => {
    const metadata = ref<{
      roles?: MetadataWithVersion<RolesMetadata>;
    }>({});

    function updateRoles(value: RolesMetadata, version: string) {
      if (!metadata.value.roles) {
        metadata.value.roles = { value, version };
      } else {
        metadata.value.roles.value = value;
        metadata.value.roles.version = version;
      }
    }

    function $reset() {
      metadata.value = { roles: undefined };
    }

    return { metadata, updateRoles, $reset };
  },
  {
    persist: {
      key: "metadata-store",
      storage: localStorage,
    },
  },
);
