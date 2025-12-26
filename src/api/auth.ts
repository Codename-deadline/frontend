import { client } from "./client";
import { Endpoint, getEndpoint } from "./endpoints";
import { type SignInRequest, SignInRequestSchema } from "./schemas/auth/SignInRequest";
import { SignInResponseSchema } from "./schemas/auth/SignInResponse";
import { type SignUpRequest, SignUpRequestSchema } from "./schemas/auth/SignUpRequest";
import { SignUpResponseSchema } from "./schemas/auth/SignUpResponse";
import { type VerifyOtpRequest, VerifyOtpRequestSchema } from "./schemas/auth/VerifyOtpRequest";
import { VerifyOtpResponseSchema } from "./schemas/auth/VerifyOtpResponse";
import { validateAndRequest, validateWith } from "./utils";

export const signUp = (data: SignUpRequest) =>
  validateAndRequest(SignUpRequestSchema, data, (validated) =>
    client.post(getEndpoint(Endpoint.AUTH_SIGN_UP), validated, {
      validate: validateWith(SignUpResponseSchema),
    }),
  );

export const signIn = async (data: SignInRequest) =>
  validateAndRequest(SignInRequestSchema, data, (validated) =>
    client.post(getEndpoint(Endpoint.AUTH_SIGN_IN), validated, {
      validate: validateWith(SignInResponseSchema),
    }),
  );

export const verifyOtp = async (data: VerifyOtpRequest) =>
  validateAndRequest(VerifyOtpRequestSchema, data, (validated) =>
    client.post(getEndpoint(Endpoint.AUTH_VERIFY_OTP), validated, {
      validate: validateWith(VerifyOtpResponseSchema),
    }),
  );
