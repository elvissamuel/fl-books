"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { NotificationFilter } from "@/core/notifications/private-api";
import { unwrapAction } from "@/features/auth/unwrap-action";
import { notificationKeys } from "@/features/notifications/query-keys";
import {
  deletePrivateNotification,
  filterPrivateNotifications,
  getPrivateNotification,
  getPrivateNotificationUnreadCount,
  listPrivateNotifications,
  markAllPrivateNotificationsRead,
  markPrivateNotificationRead,
} from "@/infrastructure/notifications/notification-actions";

export function usePrivateNotifications(query: NotificationFilter, enabled = true) {
  return useQuery({
    queryKey: notificationKeys.list(query),
    queryFn: async () => unwrapAction(await listPrivateNotifications(query)),
    enabled,
  });
}

export function usePrivateNotificationFilter(query: NotificationFilter) {
  return useQuery({
    queryKey: notificationKeys.filter(query),
    queryFn: async () => unwrapAction(await filterPrivateNotifications(query)),
  });
}

export function usePrivateNotification(id: string) {
  return useQuery({
    queryKey: notificationKeys.detail(id),
    queryFn: async () => unwrapAction(await getPrivateNotification(id)),
    enabled: id.length > 0,
  });
}

export function usePrivateNotificationUnreadCount() {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: async () => unwrapAction(await getPrivateNotificationUnreadCount()),
  });
}

export function useMarkPrivateNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => unwrapAction(await markPrivateNotificationRead(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
  });
}

export function useMarkAllPrivateNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => unwrapAction(await markAllPrivateNotificationsRead()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
  });
}

export function useDeletePrivateNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => unwrapAction(await deletePrivateNotification(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
  });
}
