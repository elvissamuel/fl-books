export type Testimonial = {
  id: string;
  name: string;
  role: string;
  message: string;
  avatarSrc: string;
};

export type TestimonialListParams = {
  page: number;
  pageSize: number;
};

export type TestimonialListPage = {
  items: Testimonial[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
};

export type CreateTestimonialPayload = {
  name: string;
  role: string;
  message: string;
  photoDataUrl: string | null;
};

export interface TestimonialsApi {
  list(params: TestimonialListParams): Promise<TestimonialListPage>;
  create(payload: CreateTestimonialPayload): Promise<Testimonial>;
}
