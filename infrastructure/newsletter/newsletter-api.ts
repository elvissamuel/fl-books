import type {
  NewsletterApi,
  NewsletterListPage,
  NewsletterListParams,
  NewsletterSubscriber,
} from "@/core/newsletter/types";

const pageSize = 7;
const totalPages = 17;
const screenshotPage = 4;

const screenshotSubscriber = {
  email: "thankindia@gmail.com",
  subscribedOn: "23/06/2026",
} as const satisfies Omit<NewsletterSubscriber, "id">;

function createCatalog(): NewsletterSubscriber[] {
  return Array.from({ length: pageSize * totalPages }, (_, index) => {
    const onScreenshotPage =
      index >= (screenshotPage - 1) * pageSize && index < screenshotPage * pageSize;

    return {
      id: `subscriber-${index + 1}`,
      email: onScreenshotPage ? screenshotSubscriber.email : `subscriber${index + 1}@gmail.com`,
      subscribedOn: onScreenshotPage
        ? screenshotSubscriber.subscribedOn
        : `0${(index % 9) + 1}/05/2026`,
    };
  });
}

const catalog = createCatalog();

export const defaultNewsletterListParams: NewsletterListParams = {
  page: screenshotPage,
  pageSize,
};

export function listNewsletterSubscribers(params: NewsletterListParams): NewsletterListPage {
  const totalCount = catalog.length;
  const pages = Math.max(1, Math.ceil(totalCount / params.pageSize));
  const page = Math.min(Math.max(params.page, 1), pages);
  const start = (page - 1) * params.pageSize;

  return {
    items: catalog.slice(start, start + params.pageSize),
    page,
    pageSize: params.pageSize,
    totalPages: pages,
    totalCount,
  };
}

export const newsletterEndpoints = {
  list: (params: NewsletterListParams) => {
    const search = new URLSearchParams({
      page: String(params.page),
      pageSize: String(params.pageSize),
    });
    return `/api/admin/newsletter?${search.toString()}`;
  },
};

export const newsletterApi: NewsletterApi = {
  async list(params) {
    return listNewsletterSubscribers(params);
  },
};
