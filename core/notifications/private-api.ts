import type { ApiResponse } from "@/core/auth/admin-api";

export const notificationTypes = ["NEW_PAID_ORDER", "PURCHASE_SUCCESSFUL"] as const;

export type NotificationType = (typeof notificationTypes)[number];

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  orderId: string;
  read: boolean;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type NotificationFilter = {
  page: number;
  size: number;
  search?: string;
  read?: boolean;
  type?: NotificationType;
  orderId?: string;
};

export type PaginatedNotifications = {
  totalPage: number;
  numberOfElements: number;
  totalElements: number;
  data: Notification[];
};

export interface PrivateNotificationsApi {
  filter(
    request: NotificationFilter,
    accessToken: string,
  ): Promise<ApiResponse<PaginatedNotifications>>;
  markRead(id: string, accessToken: string): Promise<ApiResponse<Notification>>;
  markAllRead(accessToken: string): Promise<ApiResponse<number>>;
  list(query: NotificationFilter, accessToken: string): Promise<ApiResponse<PaginatedNotifications>>;
  get(id: string, accessToken: string): Promise<ApiResponse<Notification>>;
  delete(id: string, accessToken: string): Promise<ApiResponse<string>>;
  unreadCount(accessToken: string): Promise<ApiResponse<number>>;
}
