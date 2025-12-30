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
  ORGANIZATION_GET: {
    path: "/organization/{orgId}",
    params: {} as { orgId: number },
  },
  ORGANIZATION_CREATE: {
    path: "/organization",
    params: {} as { orgId: number },
  },
  ORGANIZATION_DELETE: {
    path: "/organization/{orgId}",
    params: {} as { orgId: number },
  },
  ORGANIZATION_PATCH: {
    path: "/organization/{orgId}",
    params: {} as { orgId: number },
  },
  ORGANIZATION_MEMBERS: {
    path: "/organization/{orgId}/members",
    params: {} as { orgId: number },
  },
  ORGANIZATION_REMOVE_MEMBER: {
    path: "/organization/{orgId}/members/{memberId}",
    params: {} as { orgId: number; memberId: number },
  },
} as const;

export type EndpointSpec<PathParams = void> = {
  path: string;
  params?: PathParams;
};

type EndpointKey = keyof typeof endpoints;

type PathParams<K extends EndpointKey> = (typeof endpoints)[K] extends { params: infer P } ? P : undefined;

const buildPath = (path: string, params?: Record<string, string | number>): string => {
  if (!params) return `${endpointPrefix}${path}`;

  let result = path;
  for (const [key, value] of Object.entries(params)) {
    result = result.replace(`{${key}}`, encodeURIComponent(String(value)));
  }

  return `${endpointPrefix}${result}`;
};

export const getEndpoint = <K extends EndpointKey>(
  key: K,
  ...args: PathParams<K> extends void ? [] : [params: PathParams<K>]
): string => {
  const spec = endpoints[key];
  return buildPath(spec.path, args[0] as Record<string, string | number>);
};
