import { client } from "@/api/client";
import { getEndpoint } from "@/api/endpoints";
import { EmptySchema } from "@/api/schemas/common/Empty";
import { type RolesMetadata, RolesMetadataSchema } from "./schemas/roles/metadata";
import { type ChangeOrganizationRoleRequest, ChangeOrganizationRoleRequestSchema } from "./schemas/roles/requests/ChangeOrganizationRoleRequest";
import { validateAndRequest, validateWith } from "./utils";
import { ChangeThreadRoleRequestSchema, type ChangeThreadRoleRequest } from "./schemas/roles/requests/ChangeThreadRoleRequest";
import { ChangeDeadlineRoleRequestSchema, type ChangeDeadlineRoleRequest } from "./schemas/roles/requests/ChangeDeadlineRoleRequest";

export const getRolesMetadata = async () =>
  validateAndRequest(EmptySchema, {}, () =>
    client.get<RolesMetadata>(getEndpoint("ROLES_METADATA"), {
      validate: validateWith(RolesMetadataSchema),
    }),
  );

export const changeOrganizationMemberRole = async (organizationId: number, request: ChangeOrganizationRoleRequest) =>
  validateAndRequest(ChangeOrganizationRoleRequestSchema, request, () =>
    client.post(getEndpoint("ROLES_CHANGE_ORGANIZATION", { pathParams: { orgId: organizationId } }), request),
  );

export const changeThreadMemberRole = async (threadId: number, request: ChangeThreadRoleRequest) =>
  validateAndRequest(ChangeThreadRoleRequestSchema, request, () =>
    client.post(getEndpoint("ROLES_CHANGE_THREAD", { pathParams: { threadId } }), request),
  );

export const changeDeadlineMemberRole = async (deadlineId: number, request: ChangeDeadlineRoleRequest) =>
  validateAndRequest(ChangeDeadlineRoleRequestSchema, request, () =>
    client.post(getEndpoint("ROLES_CHANGE_DEADLINE", { pathParams: { deadlineId } }), request),
  );
