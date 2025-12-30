import { client } from "./client";
import { getEndpoint } from "./endpoints";
import { EmptySchema } from "./schemas/common/Empty";
import type { User } from "./schemas/common/User";
import { validateAndRequest } from "./utils";

export const getMe = () =>
  validateAndRequest(EmptySchema, {}, (validated) => client.get<User>(getEndpoint("USER_ME"), validated));
