'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface RealtimeEvent {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  record: any;
  old_record?: any;
}

export interface Notification {
  id: string;
  type: 'appointment_created' | 'appointment_updated' | 'appointment_cancelled' | 'payment_received' | 'customer_registered' | 'staff_schedule_updated';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: string;
}

export function useRealtime() {
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Connect to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('salon_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, handleAppointmentChange)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'customers' }, handleCustomerChange)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, handleServiceChange)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'staff' }, handleStaffChange)
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  // Handle appointment changes
  const handleAppointmentChange = useCallback((payload: RealtimeEvent) => {
    const { type, record, old_record } = payload;

    let notification: Notification | null = null;

    switch (type) {
      case 'INSERT':
        notification = {
          id: `apt_${record.id}_${Date.now()}`,
          type: 'appointment_created',
          title: 'New Appointment',
          message: `Appointment scheduled for ${record.date} at ${record.time}`,
          data: record,
          read: false,
          createdAt: new Date().toISOString()
        };
        break;

      case 'UPDATE':
        if (old_record?.status !== record.status) {
          const statusMessage = getStatusMessage(record.status);
          notification = {
            id: `apt_${record.id}_${Date.now()}`,
            type: record.status === 'cancelled' ? 'appointment_cancelled' : 'appointment_updated',
            title: 'Appointment Updated',
            message: `Appointment status changed to ${statusMessage}`,
            data: record,
            read: false,
            createdAt: new Date().toISOString()
          };
        }
        break;

      case 'DELETE':
        notification = {
          id: `apt_del_${record.id}_${Date.now()}`,
          type: 'appointment_cancelled',
          title: 'Appointment Cancelled',
          message: `Appointment for ${record.date} at ${record.time} was cancelled`,
          data: record,
          read: false,
          createdAt: new Date().toISOString()
        };
        break;
    }

    if (notification) {
      addNotification(notification);
    }
  }, []);

  // Handle customer changes
  const handleCustomerChange = useCallback((payload: RealtimeEvent) => {
    const { type, record } = payload;

    if (type === 'INSERT') {
      const notification: Notification = {
        id: `cust_${record.id}_${Date.now()}`,
        type: 'customer_registered',
        title: 'New Customer',
        message: `${record.firstName} ${record.lastName} registered as a new customer`,
        data: record,
        read: false,
        createdAt: new Date().toISOString()
      };

      addNotification(notification);
    }
  }, []);

  // Handle service changes
  const handleServiceChange = useCallback((payload: RealtimeEvent) => {
    // Handle service updates if needed
    console.log('Service changed:', payload);
  }, []);

  // Handle staff changes
  const handleStaffChange = useCallback((payload: RealtimeEvent) => {
    const { type, record } = payload;

    if (type === 'UPDATE' && record.schedule_updated) {
      const notification: Notification = {
        id: `staff_${record.id}_${Date.now()}`,
        type: 'staff_schedule_updated',
        title: 'Staff Schedule Updated',
        message: `${record.name}'s schedule has been updated`,
        data: record,
        read: false,
        createdAt: new Date().toISOString()
      };

      addNotification(notification);
    }
  }, []);

  // Add notification
  const addNotification = useCallback((notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
  }, []);

  // Mark notification as read
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  }, []);

  // Clear notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Get unread notifications
  const getUnreadNotifications = useCallback(() => {
    return notifications.filter(notif => !notif.read);
  }, [notifications]);

  // Get notifications by type
  const getNotificationsByType = useCallback((type: Notification['type']) => {
    return notifications.filter(notif => notif.type === type);
  }, [notifications]);

  // Send notification (for manual notifications)
  const sendNotification = useCallback(async (
    type: Notification['type'],
    title: string,
    message: string,
    data?: any
  ) => {
    const notification: Notification = {
      id: `${type}_${Date.now()}`,
      type,
      title,
      message,
      data,
      read: false,
      createdAt: new Date().toISOString()
    };

    addNotification(notification);

    // Optionally send to external services (email, SMS, etc.)
    try {
      await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notification)
      });
    } catch (err) {
      console.error('Failed to send external notification:', err);
    }
  }, [addNotification]);

  return {
    isConnected,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    getUnreadNotifications,
    getNotificationsByType,
    sendNotification
  };
}

// Helper function to get status message
function getStatusMessage(status: string): string {
  switch (status) {
    case 'confirmed': return 'Confirmed';
    case 'in-progress': return 'In Progress';
    case 'completed': return 'Completed';
    case 'cancelled': return 'Cancelled';
    case 'no-show': return 'No Show';
    default: return status;
  }
}
