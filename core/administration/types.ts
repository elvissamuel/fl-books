export type AdminStatus = "active" | "inactive";

export type AdminPermission =
  | "dashboard"
  | "books"
  | "orders"
  | "customers"
  | "pickup-stations"
  | "administration"
  | "settings";

export type StaffAdmin = {
  id: string;
  initials: string;
  name: string;
  email: string;
  phoneMask: string;
  permissionsLabel: string;
  usernameMask: string;
  status: AdminStatus;
};

export type AdminListFilter = "all" | AdminStatus;

export type AdminListParams = {
  search: string;
  filter: AdminListFilter;
};

export type AdminListPage = {
  items: StaffAdmin[];
};

export type CreateStaffAdminPayload = {
  firstName: string;
  surname: string;
  email: string;
  password: string;
  status: AdminStatus;
  permissions: AdminPermission[];
};

export interface AdministrationApi {
  list(params: AdminListParams): Promise<AdminListPage>;
  create(payload: CreateStaffAdminPayload): Promise<StaffAdmin>;
}
