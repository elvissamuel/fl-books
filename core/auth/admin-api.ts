export type AdminGender = "MALE" | "FEMALE";

export type AdminPermission =
  | "BOOK_CREATE"
  | "BOOK_VIEW"
  | "BOOK_UPDATE"
  | "BOOK_DELETE"
  | "CUSTOMER_VIEW"
  | "CUSTOMER_UPDATE"
  | "CUSTOMER_DELETE"
  | "CURRENCY_CREATE"
  | "CURRENCY_VIEW"
  | "CURRENCY_UPDATE"
  | "CURRENCY_DELETE"
  | "DISTANCE_BAND_CREATE"
  | "DISTANCE_BAND_VIEW"
  | "DISTANCE_BAND_UPDATE"
  | "DISTANCE_BAND_DELETE"
  | "PLATFORM_SETTINGS_CREATE"
  | "PLATFORM_SETTINGS_VIEW"
  | "PLATFORM_SETTINGS_UPDATE"
  | "PLATFORM_SETTINGS_DELETE"
  | "ADMIN_CREATE"
  | "ADMIN_VIEW"
  | "ADMIN_UPDATE"
  | "ADMIN_DELETE"
  | "ACTIVITY_LOG_VIEW";

export type AdminModule =
  | "BOOK"
  | "CUSTOMER"
  | "CURRENCY"
  | "DISTANCE_BAND"
  | "PLATFORM_SETTINGS"
  | "ADMIN"
  | "ACTIVITY_LOG";

export type AdminPermissionGroup = {
  module: AdminModule;
  permissions: AdminPermission[];
};

export type AdminAccount = {
  adminId: string;
  userId: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string | null;
  profilePictureUrl: string | null;
  profileColourCode?: string | null;
  dateOfBirth: string | null;
  gender: AdminGender | null;
  age: string | null;
  userType: "ADMIN" | "CUSTOMER";
  superAdmin: boolean;
  permissions: AdminPermissionGroup[];
  active: boolean;
  userActive: boolean;
  userVerified: boolean;
  inAppNotificationsEnabled: boolean;
  emailNotificationsEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type AdminLoginRequest = {
  emailAddress: string;
  password: string;
};

export type AdminAuthResponse = {
  accessToken: string;
  refreshToken: string;
  admin: AdminAccount;
};

export type AdminCreateRequest = {
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
  phoneNumber: string;
  profilePictureUrl: string;
  profileColourCode: string;
  gender: AdminGender;
  active: boolean;
  permissions: AdminPermission[];
};

export type AdminForgotPasswordRequest = {
  emailAddress: string;
};

export type AdminForgotPasswordResponse = {
  userId: string;
  emailAddress: string;
  otp: string;
  expiresAt: string;
};

export type AdminResetPasswordRequest = {
  emailAddress: string;
  otp: string;
  newPassword: string;
};

export type AdminUpdateRequest = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profilePictureUrl: string;
  dateOfBirth: string;
  gender: AdminGender;
  permissions: AdminPermission[];
};

export type AdminListQuery = {
  page: number;
  size: number;
  search: string;
  active?: boolean;
};

export type PaginatedAdmins = {
  totalPage: number;
  numberOfElements: number;
  totalElements: number;
  data: AdminAccount[];
};

export interface AdminAuthApi {
  login(request: AdminLoginRequest): Promise<ApiResponse<AdminAuthResponse>>;
  create(request: AdminCreateRequest, accessToken: string): Promise<ApiResponse<AdminAccount>>;
  forgotPassword(
    request: AdminForgotPasswordRequest,
  ): Promise<ApiResponse<AdminForgotPasswordResponse>>;
  resetPassword(request: AdminResetPasswordRequest): Promise<ApiResponse<string | null>>;
  get(adminId: string, accessToken: string): Promise<ApiResponse<AdminAccount>>;
  update(
    adminId: string,
    request: AdminUpdateRequest,
    accessToken: string,
  ): Promise<ApiResponse<AdminAccount>>;
  deactivate(adminId: string, accessToken: string): Promise<ApiResponse<AdminAccount>>;
  activate(adminId: string, accessToken: string): Promise<ApiResponse<AdminAccount>>;
  delete(adminId: string, accessToken: string): Promise<ApiResponse<string | null>>;
  list(query: AdminListQuery, accessToken: string): Promise<ApiResponse<PaginatedAdmins>>;
}
