import { client } from "./client";
import type { PagedResponse } from "./common/PaginationResponse";
import { getEndpoint } from "./endpoints";
import { EmptySchema } from "./schemas/common/Empty";
import type { OrganizationMember } from "./schemas/organization/Member";
import {
  type PatchOrganizationRequest,
  PatchOrganizationRequestSchema,
} from "./schemas/organization/patch/PatchOrganizationRequest";
import { validateAndRequest } from "./utils";

export const patch = async (organizationId: number, data: PatchOrganizationRequest) =>
  validateAndRequest(PatchOrganizationRequestSchema, data, (validated) =>
    client.patch(getEndpoint("ORGANIZATION_PATCH", { pathParams: { orgId: organizationId } }), validated),
  );

export const getMembers = async (organizationId: number, page: number) =>
  validateAndRequest(EmptySchema, {}, (validated) =>
    client.get<PagedResponse<OrganizationMember>>(
      getEndpoint("ORGANIZATION_MEMBERS", {
        pathParams: { orgId: organizationId },
        queryParams: { page },
      }),
      validated,
    ),
  );
