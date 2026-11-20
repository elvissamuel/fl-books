import "server-only";

import { privateCustomersApi } from "@/infrastructure/customers/http-private-customers-api";

const placeholderPhotos = new Set(["/admin-profile.png", "admin-profile.png"]);

export async function customerNavPhotoUrl(accessToken: string) {
  try {
    const response = await privateCustomersApi.getProfile(accessToken);
    const url = response.data?.profilePictureUrl?.trim() ?? "";
    if (!url || placeholderPhotos.has(url)) return "";
    return url;
  } catch {
    return "";
  }
}
