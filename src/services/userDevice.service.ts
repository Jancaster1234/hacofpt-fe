import { UserDevice } from "@/types/entities/userDevice";
import { tokenService_v0 } from "@/services/token.service_v0";

type UserDevicePayload = {
  userId: string;
  deviceId: string;
  timeFrom: string;
  timeTo: string;
  status: "ASSIGNED" | "RETURNED" | "LOST" | "DAMAGED";
  files: File[];
};

class UserDeviceService {
  async createUserDevice(data: UserDevicePayload): Promise<UserDevice> {
    try {
      const formData = new FormData();

      formData.append("userId", data.userId);
      formData.append("deviceId", data.deviceId);
      formData.append("timeFrom", data.timeFrom);
      formData.append("timeTo", data.timeTo);
      formData.append("status", data.status);

      data.files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("/identity-service/api/v1/user-devices", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenService_v0.getAccessToken()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(`Create failed: ${errMsg}`);
      }

      const dataResponse = await response.json();
      return dataResponse as UserDevice;
    } catch (error) {
      console.error("Error creating UserDevice:", error);
      throw error;
    }
  }

  async updateUserDevice(id: string, data: UserDevicePayload): Promise<UserDevice> {
    try {
      const formData = new FormData();

      formData.append("userId", data.userId);
      formData.append("deviceId", data.deviceId);
      formData.append("timeFrom", data.timeFrom);
      formData.append("timeTo", data.timeTo);
      formData.append("status", data.status);

      data.files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch(`/identity-service/api/v1/user-devices/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${tokenService_v0.getAccessToken()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(`Update failed: ${errMsg}`);
      }

      const dataResponse = await response.json();
      return dataResponse as UserDevice;
    } catch (error) {
      console.error("Error updating UserDevice:", error);
      throw error;
    }
  }

  // Get all UserDevices
  async getAllUserDevices(): Promise<UserDevice[]> {
    try {
      const response = await fetch("/identity-service/api/v1/user-devices", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenService_v0.getAccessToken()}`,
        },
      });

      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(`Failed to fetch user devices: ${errMsg}`);
      }

      const dataResponse = await response.json();
      return dataResponse.data as UserDevice[];
    } catch (error) {
      console.error("Error fetching UserDevices:", error);
      throw error;
    }
  }

  // Get UserDevice by ID
  async getUserDevice(id: string): Promise<UserDevice> {
    try {
      const response = await fetch(`/identity-service/api/v1/user-devices/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenService_v0.getAccessToken()}`,
        },
      });

      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(`Failed to fetch user device: ${errMsg}`);
      }

      const dataResponse = await response.json();
      return dataResponse.data as UserDevice;
    } catch (error) {
      console.error("Error fetching UserDevice:", error);
      throw error;
    }
  }

  // Get UserDevices by deviceId
  async getUserDevicesByDeviceId(deviceId: string): Promise<UserDevice[]> {
    try {
      const response = await fetch(`/identity-service/api/v1/user-devices/device/${deviceId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenService_v0.getAccessToken()}`,
        },
      });

      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(`Failed to fetch user devices by deviceId: ${errMsg}`);
      }

      const dataResponse = await response.json();
      return dataResponse.data as UserDevice[];
    } catch (error) {
      console.error("Error fetching UserDevices by deviceId:", error);
      throw error;
    }
  }

  // Get UserDevices by userId
  async getUserDevicesByUserId(userId: string): Promise<UserDevice[]> {
    try {
      const response = await fetch(`/identity-service/api/v1/user-devices/user/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenService_v0.getAccessToken()}`,
        },
      });

      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(`Failed to fetch user devices by userId: ${errMsg}`);
      }

      const dataResponse = await response.json();
      return dataResponse.data as UserDevice[];
    } catch (error) {
      console.error("Error fetching UserDevices by userId:", error);
      throw error;
    }
  }

  // Delete UserDevice
  async deleteUserDevice(id: string): Promise<void> {
    try {
      const response = await fetch(`/identity-service/api/v1/user-devices/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${tokenService_v0.getAccessToken()}`,
        },
      });

      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(`Failed to delete user device: ${errMsg}`);
      }

      console.log("UserDevice deleted successfully");
    } catch (error) {
      console.error("Error deleting UserDevice:", error);
      throw error;
    }
  }
}

export const userDeviceService = new UserDeviceService();
