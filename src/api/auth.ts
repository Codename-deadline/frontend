import { client } from "./client";
import { Endpoint, getEndpoint } from "./endpoints";
import { type SignInRequest, SignInRequestSchema } from "./schemas/auth/SignInRequest";
import { SignInResponseSchema } from "./schemas/auth/SignInResponse";
import { type SignUpRequest, SignUpRequestSchema } from "./schemas/auth/SignUpRequest";
import { SignUpResponseSchema } from "./schemas/auth/SignUpResponse";
import { type VerifyOtpRequest, VerifyOtpRequestSchema } from "./schemas/auth/VerifyOtpRequest";
import { VerifyOtpResponseSchema } from "./schemas/auth/VerifyOtpResponse";
import { validateWith } from "./utils";

export const signUp = async (data: SignUpRequest) => {
  const result = SignUpRequestSchema.safeParse(data);
  if (!result.success) {
    console.error("Invalid request:", result.error);
    return;
  }

  return await client.post(getEndpoint(Endpoint.AUTH_SIGN_UP), data, {
    validate: validateWith(SignUpResponseSchema),
  });
};

export const signIn = async (data: SignInRequest) => {
  const result = SignInRequestSchema.safeParse(data);
  if (!result.success) {
    console.error("Invalid request:", result.error);
    return;
  }

  return await client.post(getEndpoint(Endpoint.AUTH_SIGN_IN), data, {
    validate: validateWith(SignInResponseSchema),
  });
};

export const verifyOtp = async (data: VerifyOtpRequest) => {
  const result = VerifyOtpRequestSchema.safeParse(data);
  if (!result.success) {
    console.error("Invalid request:", result.error);
    return;
  }

  return await client.post(getEndpoint(Endpoint.AUTH_VERIFY_OTP), data, {
    validate: validateWith(VerifyOtpResponseSchema),
  });
};
