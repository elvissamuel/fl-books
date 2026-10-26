"use client";

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string; sessionExpired?: boolean };

export async function unwrapAction<T>(result: ActionResult<T>): Promise<T> {
  if (!result.ok) {
    if (result.sessionExpired) {
      window.location.assign("/admin/login");
      return new Promise(() => {});
    }
    throw new Error(result.message);
  }

  return result.data;
}
