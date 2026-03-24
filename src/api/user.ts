import z from "zod";
import { client } from "./client";
import { getEndpoint } from "./endpoints";
import { EmptySchema } from "./schemas/common/Empty";
import { type User, UserSchema } from "./schemas/common/User";
import {
  type PagedOrganizationWithRole,
  PagedOrganizationWithRoleSchema,
} from "./schemas/organization/common/Organization";
import { validateAndRequest, validateWith } from "./utils";

export const getMe = async () =>
  validateAndRequest(EmptySchema, {}, () =>
    client.get<User>(getEndpoint("USER_ME"), {
      validate: validateWith(UserSchema),
    }),
  );

export const getOrganizations = async (page: number) =>
  validateAndRequest(EmptySchema, {}, () =>
    client.get<PagedOrganizationWithRole>(
      getEndpoint("USER_MY_ORGANIZATIONS", {
        queryParams: { page },
      }),
      {
        validate: validateWith(PagedOrganizationWithRoleSchema),
      },
    ),
  );

export const getUsersWithUsernameStartingWith = async (startsWith: string) =>
  validateAndRequest(EmptySchema, {}, () =>
    client.get<string[]>(
      getEndpoint("USER_USERNAME_HINTS", {
        queryParams: { startsWith },
      }),
      {
        validate: validateWith(z.array(z.string())),
      },
    ),
  );
