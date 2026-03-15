import { client } from "@/api/client";
import { getEndpoint } from "@/api/endpoints";
import { EmptySchema } from "@/api/schemas/common/Empty";
import { type RolesMetadata, RolesMetadataSchema } from "./schemas/roles/metadata";
import { validateAndRequest, validateWith } from "./utils";

export const getRolesMetadata = async () =>
  validateAndRequest(EmptySchema, {}, () =>
    client.get<RolesMetadata>(getEndpoint("ROLES_METADATA"), {
      validate: validateWith(RolesMetadataSchema),
    }),
  );
