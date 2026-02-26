import { client } from "./client";
import { getEndpoint } from "./endpoints";
import { EmptySchema } from "./schemas/common/Empty";
import type { Organization } from "./schemas/organization/common/Organization";
import { validateAndRequest } from "./utils";

export const create = async (organizationId: number) =>
  validateAndRequest(EmptySchema, {}, (validated) =>
    client.get<Organization>(getEndpoint("ORGANIZATION_GET", {
      pathParams: { orgId: organizationId }
    }), validated),
  );

export const getById = async (organizationId: number) =>
  validateAndRequest(EmptySchema, {}, (validated) =>
    client.get<Organization>(getEndpoint("ORGANIZATION_CREATE", {
      pathParams: { orgId: organizationId }
    }), validated),
  );
