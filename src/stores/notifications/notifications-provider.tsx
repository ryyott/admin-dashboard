"use client";

import { createContext, useContext, useRef } from "react";

import { useStore, type StoreApi } from "zustand";

import type { Notification } from "@/types/notifications";

import { createNotificationsStore, NotificationsState } from "./notifications-store";

const NotificationsStoreContext = createContext<StoreApi<NotificationsState> | null>(null);

export const NotificationsStoreProvider = ({
  children,
  initialNotifications = [],
}: {
  children: React.ReactNode;
  initialNotifications?: Notification[];
}) => {
  const storeRef = useRef<StoreApi<NotificationsState> | null>(null);

  if (!storeRef.current) {
    const unreadCount = initialNotifications.filter((n) => !n.read).length;
    storeRef.current = createNotificationsStore({
      notifications: initialNotifications,
      unreadCount,
    });
  }

  return <NotificationsStoreContext.Provider value={storeRef.current}>{children}</NotificationsStoreContext.Provider>;
};

export const useNotificationsStore = <T,>(selector: (state: NotificationsState) => T): T => {
  const store = useContext(NotificationsStoreContext);
  if (!store) throw new Error("Missing NotificationsStoreProvider");
  return useStore(store, selector);
};
