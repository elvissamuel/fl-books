"use client";

import { useMutation } from "@tanstack/react-query";
import type {
  DeleteFileRequest,
  DeleteFilesRequest,
  UploadFileRequest,
  UploadFilesRequest,
} from "@/core/files/private-api";
import { unwrapAction } from "@/features/auth/unwrap-action";
import {
  deletePrivateFile,
  deletePrivateFiles,
  uploadPrivateFile,
  uploadPrivateFiles,
} from "@/infrastructure/files/files-actions";

export function useUploadPrivateFile() {
  return useMutation({
    mutationFn: async (request: UploadFileRequest) => unwrapAction(await uploadPrivateFile(request)),
  });
}

export function useUploadPrivateFiles() {
  return useMutation({
    mutationFn: async (request: UploadFilesRequest) =>
      unwrapAction(await uploadPrivateFiles(request)),
  });
}

export function useDeletePrivateFile() {
  return useMutation({
    mutationFn: async (request: DeleteFileRequest) => unwrapAction(await deletePrivateFile(request)),
  });
}

export function useDeletePrivateFiles() {
  return useMutation({
    mutationFn: async (request: DeleteFilesRequest) =>
      unwrapAction(await deletePrivateFiles(request)),
  });
}
