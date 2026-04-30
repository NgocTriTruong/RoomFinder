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

    // ... existing websocket logic ...
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
