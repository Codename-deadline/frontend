import { client } from "./client";
import type { PagedResponse } from "./common/PaginationResponse";
import { getEndpoint } from "./endpoints";
import { EmptySchema } from "./schemas/common/Empty";
import {
  type CreateOrganizationRequest,
  CreateOrganizationRequestSchema,
} from "./schemas/organization/create/CreateOrganizationRequest";
import { CreateOrganizationResponseSchema } from "./schemas/organization/create/CreateOrganizationResponse";
import { type OrganizationInvitation, OrganizationInvitationSchema } from "./schemas/organization/Invitation";
import type { OrganizationMember } from "./schemas/organization/Member";
import {
  type PatchOrganizationRequest,
  PatchOrganizationRequestSchema,
} from "./schemas/organization/patch/PatchOrganizationRequest";
import { validateAndRequest, validateWith } from "./utils";

export const createOrganization = async (request: CreateOrganizationRequest) =>
  validateAndRequest(CreateOrganizationRequestSchema, request, (validated) =>
    client.post(getEndpoint("ORGANIZATION_CREATE"), validated, {
      validate: validateWith(CreateOrganizationResponseSchema),
    }),
  );

export const deleteOrganization = async (organizationId: number) =>
  validateAndRequest(EmptySchema, {}, (validated) =>
    client.delete(getEndpoint("ORGANIZATION_DELETE", { pathParams: { orgId: organizationId } }), validated),
  );

export const patchOrganization = async (organizationId: number, data: PatchOrganizationRequest) =>
  validateAndRequest(PatchOrganizationRequestSchema, data, (validated) =>
    client.patch(getEndpoint("ORGANIZATION_PATCH", { pathParams: { orgId: organizationId } }), validated),
  );

export const getOrganizationMembers = async (organizationId: number, page: number, size: number) =>
  validateAndRequest(EmptySchema, {}, (validated) =>
    client.get<PagedResponse<OrganizationMember>>(
      getEndpoint("ORGANIZATION_MEMBERS", {
        pathParams: { orgId: organizationId },
        queryParams: { page, size },
      }),
      validated,
    ),
  );

export const inviteMemberToOrganization = async (organizationId: number, data: OrganizationInvitation) =>
  validateAndRequest(OrganizationInvitationSchema, data, (validated) =>
    client.post(getEndpoint("ORGANIZATION_INVITE_MEMBER", { pathParams: { orgId: organizationId } }), validated),
  );

export const removeOrganizationMember = async (organizationId: number, username: string) =>
  validateAndRequest(EmptySchema, {}, (validated) =>
    client.delete(
      getEndpoint("ORGANIZATION_REMOVE_MEMBER", {
        pathParams: { orgId: organizationId, username: username },
      }),
      validated,
    ),
  );
