"use client";

import type {
  DeleteFileRequest,
  DeleteFilesRequest,
  UploadFileRequest,
  UploadFilesRequest,
  UploadedFile,
} from "@/core/files/private-api";
import { browserApi } from "@/infrastructure/http/browser-api";

function withCategory(path: string, category?: UploadFileRequest["category"]) {
  if (!category) return path;
  return `${path}?${new URLSearchParams({ category }).toString()}`;
}

export async function uploadPrivateFile(request: UploadFileRequest) {
  const body = new FormData();
  body.append("file", request.file);
  return browserApi<UploadedFile>(withCategory("/api/v1/file/private/upload", request.category), {
    method: "POST",
    body,
  });
}

export async function uploadPrivateFiles(request: UploadFilesRequest) {
  const body = new FormData();
  for (const file of request.files) body.append("files", file);
  return browserApi<UploadedFile[]>(
    withCategory("/api/v1/file/private/upload/bulk", request.category),
    { method: "POST", body },
  );
}

export async function deletePrivateFile(request: DeleteFileRequest) {
  return browserApi<string>("/api/v1/file/private/delete/async", {
    method: "POST",
    json: request,
    allowEmptyData: true,
  });
}

export async function deletePrivateFiles(request: DeleteFilesRequest) {
  return browserApi<string>("/api/v1/file/private/delete/async/bulk", {
    method: "POST",
    json: request,
    allowEmptyData: true,
  });
}
