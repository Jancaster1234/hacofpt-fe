// src/services/notification.service.ts
import { tokenService_v0 } from "@/services/token.service_v0";

type NotificationPayload = {
  type: "MESSAGE" | "MENTOR_REQUEST" | "TEAM_INVITE" | "HACKATHON_UPDATE" | "TASK_UPDATE" | "GENERAL";
  content: string;
  metadata: string;
  notificationDeliveryRequest: {
    recipientIds: string[];
    role: "ADMIN" | "ORGANIZER" | "JUDGE" | "MENTOR" | "GUEST" | "TEAM_MEMBER" | "TEAM_LEADER";
    method: "IN_APP" | "EMAIL" | "PUSH" | "SMS" | "WEB";
  };
};

type BulkUpdateReadStatusRequest = {
  notificationIds: string[]; 
  isRead: boolean;
};

class NotificationService {

  async createNotification(payload: NotificationPayload): Promise<any> {
    const { type, content, metadata, notificationDeliveryRequest } = payload;

    const notificationRequest = {
      type,
      content,
      metadata,
      notificationDeliveryRequest,
    };

    try {
      const response = await fetch('/communication-service/api/v1/notifications', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenService_v0.getAccessToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationRequest),
      });

      if (!response.ok) {
        throw new Error('Failed to create notification');
      }

      const responseData = await response.json();
      return responseData.data;

    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  }

  // Get all notifications
  async getNotifications(): Promise<any[]> {
    try {
      const response = await fetch('/communication-service/api/v1/notifications', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tokenService_v0.getAccessToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const responseData = await response.json();
      return responseData.data;

    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  }

  // Get a notification by ID
  async getNotification(id: string): Promise<any> {
    try {
      const response = await fetch(`/communication-service/api/v1/notifications/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tokenService_v0.getAccessToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notification');
      }

      const responseData = await response.json();
      return responseData.data;

    } catch (error) {
      console.error("Error fetching notification:", error);
      throw error;
    }
  }

  // Delete a notification by ID
  async deleteNotification(id: string): Promise<void> {
    try {
      const response = await fetch(`/communication-service/api/v1/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${tokenService_v0.getAccessToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }
    } catch (error) {
      throw error;
    }
  }

  // Bulk update read status of notifications
  async updateReadStatusBulk(request: BulkUpdateReadStatusRequest): Promise<void> {
    try {
      const response = await fetch('/communication-service/api/v1/notifications/notification-deliveries/read-status', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${tokenService_v0.getAccessToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Failed to update read status');
      }

    } catch (error) {
      throw error;
    }
  }
}
export const notificationService = new NotificationService();
