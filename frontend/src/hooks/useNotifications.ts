import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../services/api';
import notificationService from '../services/notificationService';

export interface Notification {
  id: number;
  type: string;
  title: string;
  content: string;
  icon?: string;
  color?: string;
  actionUrl?: string;
  actionType?: string;
  actionId?: number;
  isRead: boolean;
  createdAt: string;
}

export function useNotifications() {
  const { user } = useAuth();
  const token = localStorage.getItem('accessToken');
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const stompClient = useRef<Client | null>(null);

  const fetchNotifications = async (p: number, append: boolean = false) => {
    try {
      if (append) setIsLoadingMore(true);
      else setIsLoading(true);

      const data = await notificationService.getNotifications(p, 10);
      
      if (data.length < 10) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      if (append) {
        setNotifications(prev => [...prev, ...data]);
      } else {
        setNotifications(data);
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    if (!user || !token) {
      if (!user) setIsLoading(false);
      return;
    }

    // Fetch initial state
    const fetchInitial = async () => {
      await fetchNotifications(0);
      try {
        const count = await notificationService.getUnreadCount();
        setUnreadCount(count);
      } catch (err) {
        console.error('Failed to fetch unread count', err);
      }
    };
    fetchInitial();

    const getWsUrl = () => {
      const envUrl = import.meta.env.VITE_WS_URL;
      if (envUrl) {
        return envUrl;
      }
      if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
        if (window.location.port) {
          return `${protocol}//${window.location.hostname}:8080/ws`;
        }
        return `${protocol}//${window.location.host}/ws`;
      }
      return 'http://localhost:8080/ws';
    };

    const WS_BASE_URL = getWsUrl();
    const socket = SockJS(WS_BASE_URL, undefined, {
      transports: ['websocket', 'xhr-streaming', 'xhr-polling'],
    });

    const client = new Client({
      webSocketFactory: () => socket as any,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 25000,
      heartbeatOutgoing: 25000,
      onConnect: () => {
        console.log('[WS Notif] Connected to notifications channel');
        client.subscribe('/user/queue/notifications', (message) => {
          try {
            const newNotif = JSON.parse(message.body) as Notification;
            setNotifications(prev => [newNotif, ...prev]);
            setUnreadCount(prev => prev + 1);
          } catch (e) {
            console.error('[WS Notif] Failed to parse notification:', e);
          }
        });
      },
      onDisconnect: () => {
        console.log('[WS Notif] Disconnected from notifications channel');
      },
      onStompError: (frame) => {
        console.error('[WS Notif] STOMP error:', frame);
      }
    });

    stompClient.current = client;
    client.activate();

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [user, token]);

  const loadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchNotifications(nextPage, true);
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    isLoadingMore,
    hasMore,
    setUnreadCount,
    setNotifications,
    markAsRead,
    loadMore
  };
}
