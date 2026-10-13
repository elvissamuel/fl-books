import type {
  AdminListPage,
  AdminListParams,
  AdministrationApi,
  CreateStaffAdminPayload,
  StaffAdmin,
} from "@/core/administration/types";

const screenshotAdmin = {
  initials: "BJ",
  name: "Blessed johnson",
  email: "thankimdia@gmail.com",
  phoneMask: "********657",
  permissionsLabel: "Pickup Station, Books & Orders",
  usernameMask: "tha*****ki",
} as const;

function createCatalog(): StaffAdmin[] {
  return Array.from({ length: 5 }, (_, index) => ({
    id: `admin-${index + 1}`,
    ...screenshotAdmin,
    status: index === 0 ? "inactive" : "active",
  }));
}

const catalog = createCatalog();

export const defaultAdminListParams: AdminListParams = {
  search: "",
  filter: "all",
};

export function listStaffAdmins(params: AdminListParams): AdminListPage {
  const search = params.search.trim().toLowerCase();
  const items = catalog.filter((admin) => {
    if (params.filter !== "all" && admin.status !== params.filter) return false;
    if (!search) return true;
    return (
      admin.name.toLowerCase().includes(search) ||
      admin.email.toLowerCase().includes(search) ||
      admin.phoneMask.includes(search) ||
      admin.permissionsLabel.toLowerCase().includes(search) ||
      admin.usernameMask.toLowerCase().includes(search)
    );
  });

  return { items };
}

export function createStaffAdmin(payload: CreateStaffAdminPayload): StaffAdmin {
  const name = `${payload.firstName} ${payload.surname}`.trim();
  const initials = `${payload.firstName.charAt(0)}${payload.surname.charAt(0)}`.toUpperCase();
  return {
    id: `admin-${name.toLowerCase().replace(/\s+/g, "-") || "new"}`,
    initials: initials || "NA",
    name,
    email: payload.email.trim(),
    phoneMask: "********000",
    permissionsLabel: payload.permissions.join(", "),
    usernameMask: `${payload.firstName.slice(0, 3).toLowerCase()}*****${payload.surname.slice(0, 2).toLowerCase()}`,
    status: payload.status,
  };
}

export const administrationEndpoints = {
  list: (params: AdminListParams) => {
    const search = new URLSearchParams({
      search: params.search,
      filter: params.filter,
    });
    return `/api/admin/administration?${search.toString()}`;
  },
  create: "/api/admin/administration",
};

export const administrationApi: AdministrationApi = {
  async list(params) {
    return listStaffAdmins(params);
  },
  async create(payload) {
    return createStaffAdmin(payload);
  },
};
