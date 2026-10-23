import type { CatalogBook, CreateBookRequest, UpdateBookRequest } from "@/core/books/private-api";
import type { BookDraft, PickupAllocation } from "@/core/books/types";

const emptyAllocation: PickupAllocation = {
  id: "",
  name: "",
  address: "",
  quantity: "0",
  enabled: true,
};

export const emptyBookDraft: BookDraft = {
  title: "",
  authorName: "",
  categoryId: "",
  stockQuantity: "",
  shortSummary: "",
  description: "",
  weightKg: "",
  price: "",
  coverImageUrls: "",
  inStorePickup: false,
  deliveryDispatch: false,
  bulkPurchaseAvailable: false,
  inventoryLimit: "",
  allocations: [{ ...emptyAllocation }],
};

export function bookDraftFromCatalog(book: CatalogBook): BookDraft {
  return {
    title: book.title,
    authorName: book.authorName,
    categoryId: book.category?.id ?? "",
    stockQuantity: String(book.stockQuantity),
    shortSummary: book.shortDescription,
    description: book.description,
    weightKg: String(book.weightInGrams / 1000),
    price: String(book.price),
    coverImageUrls: book.coverImageUrls.join(", "),
    inStorePickup: book.pickupAvailable,
    deliveryDispatch: book.physicalDeliveryAvailable,
    bulkPurchaseAvailable: false,
    inventoryLimit: String(book.stockQuantity),
    allocations:
      book.pickupAllocations.length > 0
        ? book.pickupAllocations.map((allocation) => ({
            id: allocation.pickupLocationId,
            name: "",
            address: "",
            quantity: String(allocation.quantity),
            enabled: allocation.enabled,
          }))
        : [{ ...emptyAllocation }],
  };
}

export function createBookRequestFromDraft(
  draft: BookDraft,
): { ok: true; request: CreateBookRequest } | { ok: false; message: string } {
  const shared = sharedBookFields(draft);
  if (!shared.ok) return shared;
  return {
    ok: true,
    request: {
      ...shared.request,
      bulkPurchaseAvailable: draft.bulkPurchaseAvailable,
    },
  };
}

export function updateBookRequestFromDraft(
  draft: BookDraft,
): { ok: true; request: UpdateBookRequest } | { ok: false; message: string } {
  return sharedBookFields(draft);
}

function sharedBookFields(
  draft: BookDraft,
): { ok: true; request: UpdateBookRequest } | { ok: false; message: string } {
  const title = draft.title.trim();
  const authorName = draft.authorName.trim();
  const categoryId = draft.categoryId.trim();
  const shortDescription = draft.shortSummary.trim();
  const description = draft.description.trim();
  const coverImageUrls = draft.coverImageUrls
    .split(/[\s,]+/)
    .map((url) => url.trim())
    .filter((url) => url.startsWith("http://") || url.startsWith("https://"));
  const price = Number(draft.price.replace(/[^\d.]/g, ""));
  const weightKg = Number(draft.weightKg);
  const weightInGrams = Number.isFinite(weightKg) ? Math.round(weightKg * 1000) : Number.NaN;
  const stockQuantity = Number(draft.stockQuantity);

  if (!title) return { ok: false, message: "Book title is required." };
  if (!authorName) return { ok: false, message: "Author name is required." };
  if (!categoryId) return { ok: false, message: "Category ID is required." };
  if (!shortDescription) return { ok: false, message: "Short summary is required." };
  if (!description) return { ok: false, message: "Full description is required." };
  if (coverImageUrls.length === 0) {
    return { ok: false, message: "Add at least one cover image URL." };
  }
  if (!Number.isFinite(price) || price <= 0) return { ok: false, message: "Price must be greater than 0." };
  if (!Number.isInteger(weightInGrams) || weightInGrams < 1) {
    return { ok: false, message: "Book weight must be at least 0.001 kg." };
  }
  if (draft.stockQuantity.trim() === "" || !Number.isInteger(stockQuantity) || stockQuantity < 0) {
    return { ok: false, message: "Stock quantity must be a whole number." };
  }

  const pickupAllocations = [];
  for (const allocation of draft.allocations) {
    const pickupLocationId = allocation.id.trim();
    const quantity = Number(allocation.quantity);
    if (!pickupLocationId && (allocation.quantity.trim() === "" || quantity === 0)) continue;
    if (!pickupLocationId) return { ok: false, message: "Each allocation needs a pickup location ID." };
    if (!Number.isInteger(quantity) || quantity < 0) {
      return { ok: false, message: "Allocation quantity must be a whole number." };
    }
    pickupAllocations.push({
      pickupLocationId,
      quantity,
      enabled: allocation.enabled,
    });
  }

  return {
    ok: true,
    request: {
      title,
      authorName,
      coverImageUrls,
      shortDescription,
      description,
      price,
      weightInGrams,
      categoryId,
      stockQuantity,
      pickupAllocations,
      physicalDeliveryAvailable: draft.deliveryDispatch,
      pickupAvailable: draft.inStorePickup,
    },
  };
}
