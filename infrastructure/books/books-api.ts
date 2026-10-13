import type {
  Book,
  BookListPage,
  BookListParams,
  BooksApi,
} from "@/core/books/types";

const screenshotBook = {
  title: "Be different",
  author: "Apostle Femi Lazarus",
  coverUrl: null,
  price: 6500,
  stock: 106,
  weightKg: 0.4,
  status: "active",
} as const satisfies Omit<Book, "id">;

const pageSize = 8;
const totalPages = 17;
const screenshotPage = 4;

function createCatalog(): Book[] {
  return Array.from({ length: pageSize * totalPages }, (_, index) => {
    const onScreenshotPage =
      index >= (screenshotPage - 1) * pageSize &&
      index < screenshotPage * pageSize;
    const inactive = !onScreenshotPage && index % 11 === 0;

    return {
      ...screenshotBook,
      id: `book-${index + 1}`,
      stock: onScreenshotPage ? 106 : 80 + (index % 40),
      price: onScreenshotPage ? 6500 : 4500 + (index % 6) * 500,
      weightKg: onScreenshotPage ? 0.4 : 0.3 + (index % 4) * 0.2,
      status: inactive ? "inactive" : "active",
    };
  });
}

const catalog = createCatalog();

export const defaultBookListParams: BookListParams = {
  search: "",
  filter: "all",
  page: screenshotPage,
  pageSize,
};

export function listBooks(params: BookListParams): BookListPage {
  const search = params.search.trim().toLowerCase();
  let items = catalog.filter((book) => {
    if (!search) return true;
    return (
      book.title.toLowerCase().includes(search) ||
      book.author.toLowerCase().includes(search)
    );
  });

  if (params.filter === "active" || params.filter === "inactive") {
    items = items.filter((book) => book.status === params.filter);
  }

  if (params.filter === "stock") {
    items = [...items].sort((left, right) => right.stock - left.stock);
  } else if (params.filter === "price") {
    items = [...items].sort((left, right) => right.price - left.price);
  } else if (params.filter === "weight") {
    items = [...items].sort((left, right) => right.weightKg - left.weightKg);
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

export const booksEndpoints = {
  list: (params: BookListParams) => {
    const search = new URLSearchParams({
      search: params.search,
      filter: params.filter,
      page: String(params.page),
      pageSize: String(params.pageSize),
    });
    return `/api/admin/books?${search.toString()}`;
  },
};

export const booksApi: BooksApi = {
  async list(params) {
    return listBooks(params);
  },
};
