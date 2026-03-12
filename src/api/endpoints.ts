const endpointPrefix: string = "/api";
const endpoints = {
  AUTH_SIGN_UP: {
    path: "/auth/register-otp",
  },
  AUTH_SIGN_IN: {
    path: "/auth/otp",
  },
  AUTH_VERIFY_OTP: {
    path: "/auth/otp/verify",
  },
  AUTH_VERIFY_PASSWORD: {
    path: "/auth/verify-password",
  },
  AUTH_REFRESH_TOKEN: {
    path: "/auth/refresh-token",
  },
  USER_ME: {
    path: "/user",
  },
  USER_MY_ORGANIZATIONS: {
    path: "/organization",
    queryParams: {} as { page: number },
  },
  ORGANIZATION_GET: {
    path: "/organization/{orgId}",
    pathParams: {} as { orgId: number },
  },
  ORGANIZATION_CREATE: {
    path: "/organization",
    pathParams: {} as { orgId: number },
  },
  ORGANIZATION_DELETE: {
    path: "/organization/{orgId}",
    pathParams: {} as { orgId: number },
  },
  ORGANIZATION_PATCH: {
    path: "/organization/{orgId}",
    pathParams: {} as { orgId: number },
  },
  ORGANIZATION_MEMBERS: {
    path: "/organization/{orgId}/members",
    pathParams: {} as { orgId: number },
  },
  ORGANIZATION_REMOVE_MEMBER: {
    path: "/organization/{orgId}/members/{memberId}",
    pathParams: {} as { orgId: number; memberId: number },
  },
} as const;

export type EndpointSpec<K extends EndpointKey> = {
  path: string;
} & (PathParams<K> extends never ? Record<string, never> : { pathParams: PathParams<K> }) &
  (QueryParams<K> extends never ? Record<string, never> : { queryParams: QueryParams<K> });

type EndpointKey = keyof typeof endpoints;

type PathParams<K extends EndpointKey> = (typeof endpoints)[K] extends { readonly pathParams: infer P } ? P : never;
type QueryParams<K extends EndpointKey> = (typeof endpoints)[K] extends { readonly queryParams: infer Q } ? Q : never;

const buildPath = (path: string, pathParams?: Record<string, string | number>): string => {
  if (!pathParams) return `${endpointPrefix}${path}`;

  let result = path;
  for (const [key, value] of Object.entries(pathParams)) {
    result = result.replace(`{${key}}`, encodeURIComponent(String(value)));
  }

  return `${endpointPrefix}${result}`;
};

const buildQuery = (query?: Record<string, string | number>): string => {
  if (!query) return "";

  const pathParams = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    pathParams.append(key, String(value));
  }
  return `?${pathParams.toString()}`;
};

export const getEndpoint = <K extends EndpointKey>(
  key: K,
  options?: {
    pathParams?: PathParams<K>;
    queryParams?: QueryParams<K>;
  },
): string => {
  const spec = endpoints[key];

  const path = buildPath(spec.path, options?.pathParams as Record<string, string | number>);
  const query = buildQuery(options?.queryParams as Record<string, string | number>);
  return `${path}${query}`;
};
