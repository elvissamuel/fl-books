export type AddCartItemRequest = {
  bookId: string;
  quantity: number;
};

export type UpdateCartItemRequest = {
  quantity: number;
};

export type CartItem = {
  cartItemId: string;
  bookId: string;
  title: string;
  slug: string;
  sku: string;
  format: string;
  coverImageUrls: string[];
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  currencyCode: string;
  available: boolean;
};

export type Cart = {
  cartId: string;
  customerId: string;
  items: CartItem[];
  distinctItemCount: number;
  totalQuantity: number;
  subtotal: number;
  currencyCode: string;
  updatedAt: string;
};
