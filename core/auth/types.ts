export type AdminCredentials = {
  email: string;
  password: string;
};

export type AuthenticatedAdmin = {
  id: string;
};

export type AdminSession = {
  userId: string;
  role: "admin";
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
