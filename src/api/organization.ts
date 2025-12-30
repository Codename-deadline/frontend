import { client } from "./client";
import { getEndpoint } from "./endpoints";
import { EmptySchema } from "./schemas/common/Empty";
import type { OrganizationResponse } from "./schemas/organization/common/OrganizationDataResponse";
import { validateAndRequest } from "./utils";

export const create = async (organizationId: number) =>
  validateAndRequest(EmptySchema, {}, (validated) =>
    client.get<OrganizationResponse>(getEndpoint("ORGANIZATION_GET", { orgId: organizationId }), validated),
  );

export const get = async (organizationId: number) =>
  validateAndRequest(EmptySchema, {}, (validated) =>
    client.get<OrganizationResponse>(getEndpoint("ORGANIZATION_CREATE", { orgId: organizationId }), validated),
  );
