import type { ApiResponse } from "@/core/auth/admin-api";

export const fileCategories = [
  "IMAGE",
  "VIDEO",
  "DOCUMENT",
  "AUDIO",
  "OTHER",
  "BOOK_THUMBNAIL",
  "PROFILE_PICTURE",
] as const;

export type FileCategory = (typeof fileCategories)[number];

export type UploadedFile = {
  fileUrl: string;
  publicId: string;
  originalFileName: string;
  format: string;
  resourceType: string;
  fileSizeBytes: number;
  category: FileCategory;
};

export type UploadFileRequest = {
  category?: FileCategory;
  file: File;
};

export type UploadFilesRequest = {
  category?: FileCategory;
  files: File[];
};

export type DeleteFileRequest = {
  fileUrl: string;
};

export type DeleteFilesRequest = {
  fileUrls: string[];
};

export interface PrivateFilesApi {
  upload(request: UploadFileRequest, accessToken: string): Promise<ApiResponse<UploadedFile>>;
  uploadBulk(
    request: UploadFilesRequest,
    accessToken: string,
  ): Promise<ApiResponse<UploadedFile[]>>;
  deleteAsync(request: DeleteFileRequest, accessToken: string): Promise<ApiResponse<string>>;
  deleteAsyncBulk(request: DeleteFilesRequest, accessToken: string): Promise<ApiResponse<string>>;
}
