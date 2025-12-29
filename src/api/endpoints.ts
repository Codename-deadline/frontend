export enum Endpoint {
  AUTH_SIGN_UP = 0,
  AUTH_SIGN_IN = 1,
  AUTH_VERIFY_OTP = 2,
  AUTH_VERIFY_PASSWORD = 3,
  AUTH_REFRESH_TOKEN = 4,
  USER_ME = 5,
}
const endpoints: Record<Endpoint, string> = {
  [Endpoint.AUTH_SIGN_UP]: "/auth/register-otp",
  [Endpoint.AUTH_SIGN_IN]: "/auth/otp",
  [Endpoint.AUTH_VERIFY_OTP]: "/auth/otp/verify",
  [Endpoint.AUTH_VERIFY_PASSWORD]: "/auth/verify-password",
  [Endpoint.AUTH_REFRESH_TOKEN]: "/auth/refresh-token",
  [Endpoint.USER_ME]: "/user",
};
const endpointPrefix: string = "/api";

const buildPath = (path: string): string => {
  return `${endpointPrefix}${path}`;
};

export const getEndpoint = (endpoint: Endpoint) => {
  return buildPath(endpoints[endpoint] as string);
};
