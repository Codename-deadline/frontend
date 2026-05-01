import { client } from "./client";
import type { PagedResponse } from "./common/PaginationResponse";
import { getEndpoint } from "./endpoints";
import { EmptySchema } from "./schemas/common/Empty";
import { type PagedThreadWithRole, PagedThreadWithRoleSchema } from "./schemas/thread/common/Thread";
import { type CreateThreadRequest, CreateThreadRequestSchema } from "./schemas/thread/create/CreateThreadRequest";
import { CreateThreadResponseSchema } from "./schemas/thread/create/CreateThreadResponse";
import type { ThreadMember } from "./schemas/thread/Member";
import { type PatchThreadRequest, PatchThreadRequestSchema } from "./schemas/thread/patch/PatchThreadRequest";
import { validateAndRequest, validateWith } from "./utils";

export const getOrganizationThreads = async (orgId: number, page: number) =>
  validateAndRequest(EmptySchema, {}, () =>
    client.get<PagedThreadWithRole>(
      getEndpoint("ORGANIZATION_THREADS", {
        pathParams: { orgId: orgId },
        queryParams: { page },
      }),
      {
        validate: validateWith(PagedThreadWithRoleSchema),
      },
    ),
  );

export const createThread = async (orgId: number, request: CreateThreadRequest) =>
  validateAndRequest(CreateThreadRequestSchema, request, (validated) =>
    client.post(getEndpoint("THREAD_CREATE", { pathParams: { orgId } }), validated, {
      validate: validateWith(CreateThreadResponseSchema),
    }),
  );

export const deleteThread = async (thrId: number) =>
  validateAndRequest(EmptySchema, {}, () => client.delete(getEndpoint("THREAD_DELETE", { pathParams: { thrId } })));

export const patchThread = async (thrId: number, request: PatchThreadRequest) =>
  validateAndRequest(PatchThreadRequestSchema, request, (validated) =>
    client.post(getEndpoint("THREAD_PATCH", { pathParams: { thrId } }), validated),
  );

export const getThreadAssignees = async (thrId: number, page: number, size: number) =>
  validateAndRequest(EmptySchema, {}, () =>
    client.get<PagedResponse<ThreadMember>>(
      getEndpoint("THREAD_ASSIGNEES", {
        pathParams: { thrId },
        queryParams: { page, size },
      }),
    ),
  );
