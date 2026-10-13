import type {
  Customer,
  CustomerDetail,
  CustomerListPage,
  CustomerListParams,
  CustomersApi,
} from "@/core/customers/types";

const pageSize = 8;
const totalPages = 17;
const screenshotPage = 4;

const screenshotCustomer = {
  name: "Blessed Johnson",
  initials: "BJ",
  location: "Lagos, Nigeria",
  email: "thankimdia@gmail.com",
  phone: "08107355412",
  totalOrders: 4,
  totalSpent: 8500,
  status: "active",
} as const satisfies Omit<Customer, "id">;

function createCatalog(): Customer[] {
  return Array.from({ length: pageSize * totalPages }, (_, index) => {
    const onScreenshotPage =
      index >= (screenshotPage - 1) * pageSize && index < screenshotPage * pageSize;
    const inactive = !onScreenshotPage && index % 5 === 0;

    return {
      ...screenshotCustomer,
      id: `customer-${index + 1}`,
      email: onScreenshotPage
        ? screenshotCustomer.email
        : `customer${index + 1}@femilazarus.books`,
      phone: onScreenshotPage
        ? screenshotCustomer.phone
        : `080${String(10000000 + index).slice(0, 8)}`,
      totalOrders: onScreenshotPage ? 4 : 1 + (index % 6),
      totalSpent: onScreenshotPage ? 8500 : 2500 + (index % 8) * 1000,
      status: inactive ? "inactive" : "active",
    };
  });
}

const catalog = createCatalog();

export const defaultCustomerListParams: CustomerListParams = {
  search: "",
  filter: "all",
  page: screenshotPage,
  pageSize,
};

export function listCustomers(params: CustomerListParams): CustomerListPage {
  const search = params.search.trim().toLowerCase();
  let items = catalog.filter((customer) => {
    if (!search) return true;
    return (
      customer.name.toLowerCase().includes(search) ||
      customer.email.toLowerCase().includes(search) ||
      customer.phone.includes(search) ||
      customer.location.toLowerCase().includes(search)
    );
  });

  if (params.filter === "active" || params.filter === "inactive") {
    items = items.filter((customer) => customer.status === params.filter);
  }

  const totalCount = items.length;
  const pages = Math.max(1, Math.ceil(totalCount / params.pageSize));
  const page = Math.min(Math.max(params.page, 1), pages);
  const start = (page - 1) * params.pageSize;

  return {
    items: items.slice(start, start + params.pageSize),
    page,
    pageSize: params.pageSize,
    totalPages: pages,
    totalCount,
  };
}

const screenshotCustomerDetail: CustomerDetail = {
  name: "Blessed Johnson",
  initials: "BJ",
  location: "Lagos, Nigeria",
  phone: "08107355412",
  email: "thankimdia@gmail.com",
  totalOrders: 4,
  totalSpent: 8500,
  status: "active",
  purchases: [
    { id: "purchase-1", itemCode: "FL-B2345", name: "Be different, Scent of water", quantity: 2, status: "shipped" },
    { id: "purchase-2", itemCode: "FL-B2345", name: "Be different, Scent of water", quantity: 2, status: "delivered" },
    { id: "purchase-3", itemCode: "FL-B2345", name: "Be different, Scent of water", quantity: 2, status: "delivered" },
    { id: "purchase-4", itemCode: "FL-B2345", name: "Be different, Scent of water", quantity: 2, status: "delivered" },
    { id: "purchase-5", itemCode: "FL-B2345", name: "Be different, Scent of water", quantity: 2, status: "delivered" },
    { id: "purchase-6", itemCode: "FL-B2345", name: "Be different, Scent of water", quantity: 2, status: "delivered" },
  ],
};

export function getCustomerDetail(_id: string): CustomerDetail {
  return screenshotCustomerDetail;
}

export const customersEndpoints = {
  list: (params: CustomerListParams) => {
    const search = new URLSearchParams({
      search: params.search,
      filter: params.filter,
      page: String(params.page),
      pageSize: String(params.pageSize),
    });
    return `/api/admin/customers?${search.toString()}`;
  },
  detail: (id: string) => `/api/admin/customers/${id}`,
};

export const customersApi: CustomersApi = {
  async list(params) {
    return listCustomers(params);
  },
  async get(id) {
    return getCustomerDetail(id);
  },
};
