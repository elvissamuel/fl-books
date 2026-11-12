import type { ApiResponse } from "@/core/auth/admin-api";
import type { GetInTouchMessage, GetInTouchWriteRequest } from "@/core/get-in-touch/private-api";

export interface PublicGetInTouchApi {
  create(request: GetInTouchWriteRequest): Promise<ApiResponse<GetInTouchMessage>>;
}
