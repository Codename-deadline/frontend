import type { InjectionKey } from "vue";
import type { User } from "@/api/schemas/common/User";
import type { ScopeType } from "@/types/scope";

export const PAGE_SIZE_KEY = Symbol() as InjectionKey<number>;
export const TOTAL_PAGES_KEY = Symbol() as InjectionKey<number>;

export const SCOPE_TYPE_KEY = Symbol() as InjectionKey<ScopeType>;
export const USER_KEY = Symbol() as InjectionKey<User | null>;
