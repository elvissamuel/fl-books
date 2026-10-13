export type NewsletterSubscriber = {
  id: string;
  email: string;
  subscribedOn: string;
};

export type NewsletterListParams = {
  page: number;
  pageSize: number;
};

export type NewsletterListPage = {
  items: NewsletterSubscriber[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
};

export interface NewsletterApi {
  list(params: NewsletterListParams): Promise<NewsletterListPage>;
}
