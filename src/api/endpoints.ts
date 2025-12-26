export enum Endpoint {
  AUTH_SIGN_UP = 0,
  AUTH_SIGN_IN = 1,
  AUTH_VERIFY_OTP = 2,
  AUTH_VERIFY_PASSWORD = 3,
}
const endpoints: Record<Endpoint, string> = {
  [Endpoint.AUTH_SIGN_UP]: "/auth/register-otp",
  [Endpoint.AUTH_SIGN_IN]: "/auth/otp",
  [Endpoint.AUTH_VERIFY_OTP]: "/auth/otp/verify",
  [Endpoint.AUTH_VERIFY_PASSWORD]: "/auth/otp/verify-password",
};
const endpointPrefix: string = "/api";

const buildPath = (path: string): string => {
  return `${endpointPrefix}${path}`;
};

export const getEndpoint = (endpoint: Endpoint) => {
  return buildPath(endpoints[endpoint] as string);
};
