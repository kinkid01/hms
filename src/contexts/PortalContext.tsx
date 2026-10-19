'use client';
import * as api from 'lib/api';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Patient, PortalNotification } from 'types/hms';

interface PortalContextValue {
  patient: Patient | null;
  notifications: PortalNotification[];
  unreadCount: number;
  refreshNotifications: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
}

const noop = async () => {};
const PortalContext = createContext<PortalContextValue>({
  patient: null,
  notifications: [],
  unreadCount: 0,
  refreshNotifications: noop,
  markRead: noop,
  markAllRead: noop,
});

export function PortalProvider({ children }: { children: ReactNode }) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [notifications, setNotifications] = useState<PortalNotification[]>([]);

  const refreshNotifications = useCallback(async () => {
    setNotifications(await api.listNotifications());
  }, []);

  useEffect(() => {
    api.getPatient().then(setPatient);
    refreshNotifications();
  }, [refreshNotifications]);

  const markRead = useCallback(async (id: string) => {
    setNotifications((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)));
    await api.markNotificationRead(id);
  }, []);

  const markAllRead = useCallback(async () => {
    setNotifications((list) => list.map((n) => ({ ...n, read: true })));
    await api.markAllNotificationsRead();
  }, []);

  return (
    <PortalContext.Provider
      value={{
        patient,
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
        refreshNotifications,
        markRead,
        markAllRead,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
}

export const usePortal = () => useContext(PortalContext);
