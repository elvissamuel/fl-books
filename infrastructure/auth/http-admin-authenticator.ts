import "server-only";

import type { AdminAuthenticator } from "@/core/auth/admin-authenticator";
import { ApiError } from "@/infrastructure/http/api-client";
import { adminAuthApi } from "@/infrastructure/auth/admin-auth-api";

const invalidMessage = "Invalid email address or password.";

export const httpAdminAuthenticator: AdminAuthenticator = {
  async authenticate(credentials) {
    try {
      const response = await adminAuthApi.login({
        emailAddress: credentials.email,
        password: credentials.password,
      });
      const session = response.data;

      if (!response.success || !session?.accessToken || !session.refreshToken) {
        return { ok: false, message: response.message || invalidMessage };
      }

      return {
        ok: true,
        admin: {
          id: session.admin.userId || session.admin.adminId,
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
        },
      };
    } catch (error) {
      if (error instanceof ApiError) {
        return { ok: false, message: error.message || invalidMessage };
      }

      throw error;
    }
  },
};
