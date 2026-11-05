import type { ApiResponse } from "@/core/auth/admin-api";
import type { AddCartItemRequest, Cart, UpdateCartItemRequest } from "@/core/cart/cart";

export interface PrivateCartApi {
  get(accessToken: string): Promise<ApiResponse<Cart>>;
  addItem(request: AddCartItemRequest, accessToken: string): Promise<ApiResponse<Cart>>;
  updateItem(
    cartItemId: string,
    request: UpdateCartItemRequest,
    accessToken: string,
  ): Promise<ApiResponse<Cart>>;
  removeItem(cartItemId: string, accessToken: string): Promise<ApiResponse<Cart>>;
  clear(accessToken: string): Promise<ApiResponse<string>>;
}
