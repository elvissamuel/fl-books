export type AdminCredentials = {
  email: string;
  password: string;
};

export type AuthenticatedAdmin = {
  id: string;
  accessToken: string;
  refreshToken: string;
};

export type AdminSession = {
  userId: string;
  role: "admin";
  accessToken: string;
  refreshToken: string;
};

export type LoginFieldErrors = {
  email?: string;
  password?: string;
};

export type LoginFormState = {
  fieldErrors: LoginFieldErrors;
  message?: string;
};

export const initialLoginState: LoginFormState = {
  fieldErrors: {},
};
