import { client } from "./client";
import { getEndpoint } from "./endpoints";
import { EmptySchema } from "./schemas/common/Empty";
import { type User, UserSchema } from "./schemas/common/User";
import { type PagedOrganization, PagedOrganizationSchema } from "./schemas/organization/common/Organization";
import { validateAndRequest, validateWith } from "./utils";

export const getMe = async () =>
  validateAndRequest(EmptySchema, {}, () =>
    client.get<User>(getEndpoint("USER_ME"), {
      validate: validateWith(UserSchema)
    })
  );

export const getOrganizations = async (page: number) =>
  validateAndRequest(EmptySchema, {}, () =>
    client.get<PagedOrganization>(getEndpoint("USER_MY_ORGANIZATIONS", {
      queryParams: { page }
    }), {
      validate: validateWith(PagedOrganizationSchema)
    })
  );
