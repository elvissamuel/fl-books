import "server-only";

import type { FileCategory, PrivateFilesApi } from "@/core/files/private-api";
import { apiJson } from "@/infrastructure/http/api-client";

export const privateFileEndpoints = {
  upload: "/api/v1/file/private/upload",
  uploadBulk: "/api/v1/file/private/upload/bulk",
  deleteAsync: "/api/v1/file/private/delete/async",
  deleteAsyncBulk: "/api/v1/file/private/delete/async/bulk",
} as const;

function withAccessToken(accessToken: string, init?: RequestInit): RequestInit {
  return {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...init?.headers,
    },
  };
}

function withCategory(path: string, category?: FileCategory) {
  if (!category) return path;
  return `${path}?${new URLSearchParams({ category }).toString()}`;
}

export const privateFilesApi: PrivateFilesApi = {
  upload(request, accessToken) {
    const body = new FormData();
    body.append("file", request.file);

    return apiJson(
      withCategory(privateFileEndpoints.upload, request.category),
      withAccessToken(accessToken, { method: "POST", body }),
    );
  },

  uploadBulk(request, accessToken) {
    const body = new FormData();
    for (const file of request.files) {
      body.append("files", file);
    }

    return apiJson(
      withCategory(privateFileEndpoints.uploadBulk, request.category),
      withAccessToken(accessToken, { method: "POST", body }),
    );
  },

  deleteAsync(request, accessToken) {
    return apiJson(
      privateFileEndpoints.deleteAsync,
      withAccessToken(accessToken, {
        method: "POST",
        body: JSON.stringify(request),
      }),
    );
  },

  deleteAsyncBulk(request, accessToken) {
    return apiJson(
      privateFileEndpoints.deleteAsyncBulk,
      withAccessToken(accessToken, {
        method: "POST",
        body: JSON.stringify(request),
      }),
    );
  },
};
