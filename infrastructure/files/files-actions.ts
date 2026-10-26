"use server";

import type { ApiResponse } from "@/core/auth/admin-api";
import type {
  DeleteFileRequest,
  DeleteFilesRequest,
  UploadFileRequest,
  UploadFilesRequest,
} from "@/core/files/private-api";
import { adminActionFailure, readActionSession } from "@/infrastructure/auth/admin-action";
import { privateFilesApi } from "@/infrastructure/files/http-files-api";

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string; sessionExpired?: boolean };

async function run<T>(
  task: (accessToken: string) => Promise<ApiResponse<T>>,
): Promise<ActionResult<T>> {
  const opened = await readActionSession();
  if (!opened.session) return opened.failure;

  try {
    return unwrap(await task(opened.session.accessToken));
  } catch (error) {
    return adminActionFailure(error);
  }
}

function unwrap<T>(response: ApiResponse<T>): ActionResult<T> {
  if (!response.success || response.data == null) {
    return { ok: false, message: response.message || "Request failed." };
  }
  return { ok: true, data: response.data };
}

export async function uploadPrivateFile(request: UploadFileRequest) {
  return run((accessToken) => privateFilesApi.upload(request, accessToken));
}

export async function uploadPrivateFiles(request: UploadFilesRequest) {
  return run((accessToken) => privateFilesApi.uploadBulk(request, accessToken));
}

export async function deletePrivateFile(request: DeleteFileRequest) {
  return run((accessToken) => privateFilesApi.deleteAsync(request, accessToken));
}

export async function deletePrivateFiles(request: DeleteFilesRequest) {
  return run((accessToken) => privateFilesApi.deleteAsyncBulk(request, accessToken));
}
