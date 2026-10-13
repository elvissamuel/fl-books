import type {
  CreateTestimonialPayload,
  Testimonial,
  TestimonialListPage,
  TestimonialListParams,
  TestimonialsApi,
} from "@/core/testimonials/types";

const pageSize = 7;
const totalPages = 17;
const screenshotPage = 4;
const avatarSrc = "/testimonials/avatar.jpg";

const screenshotTestimonial = {
  name: "Blessed Johnson",
  role: "Head Of Operations",
  message: "Possessing The Gates' shifted how I fight for what's mine. ...",
  avatarSrc,
} as const satisfies Omit<Testimonial, "id">;

const otherNames = ["Amaka Obi", "David Amos", "Grace Adeyemi", "Chinedu Okonkwo", "Sarah Mensah"];
const otherRoles = ["Pastor", "Author", "Ministry Lead", "Editor", "Volunteer"];

function createCatalog(): Testimonial[] {
  return Array.from({ length: pageSize * totalPages }, (_, index) => {
    const onScreenshotPage =
      index >= (screenshotPage - 1) * pageSize && index < screenshotPage * pageSize;

    return {
      id: `testimonial-${index + 1}`,
      name: onScreenshotPage ? screenshotTestimonial.name : otherNames[index % otherNames.length]!,
      role: onScreenshotPage ? screenshotTestimonial.role : otherRoles[index % otherRoles.length]!,
      message: onScreenshotPage
        ? screenshotTestimonial.message
        : `Testimony ${index + 1} on how the book changed the way I pray. ...`,
      avatarSrc,
    };
  });
}

const catalog = createCatalog();

export const defaultTestimonialListParams: TestimonialListParams = {
  page: screenshotPage,
  pageSize,
};

export function listTestimonials(params: TestimonialListParams): TestimonialListPage {
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

export function createTestimonial(payload: CreateTestimonialPayload): Testimonial {
  const message = payload.message.trim();
  return {
    id: `testimonial-${payload.name.trim().toLowerCase().replace(/\s+/g, "-") || "new"}`,
    name: payload.name.trim(),
    role: payload.role.trim(),
    message: message.length > 72 ? `${message.slice(0, 72).trimEnd()} ...` : message,
    avatarSrc: payload.photoDataUrl ?? avatarSrc,
  };
}

export const testimonialEndpoints = {
  list: (params: TestimonialListParams) => {
    const search = new URLSearchParams({
      page: String(params.page),
      pageSize: String(params.pageSize),
    });
    return `/api/admin/testimonials?${search.toString()}`;
  },
  create: "/api/admin/testimonials",
};

export const testimonialsApi: TestimonialsApi = {
  async list(params) {
    return listTestimonials(params);
  },
  async create(payload) {
    return createTestimonial(payload);
  },
};
