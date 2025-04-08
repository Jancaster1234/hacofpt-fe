import { Device } from "@/types/entities/device";
import { tokenService_v0 } from "@/services/token.service_v0";

// Define the payload type for creating and updating devices
type DevicePayload = {
  hackathonId: string;
  roundId: string;
  roundLocationId: string;
  name: string;
  description?: string;
  status: "AVAILABLE" | "IN_USE" | "DAMAGED" | "LOST" | "RETIRED" | "PENDING";
  files: File[];
};

class DeviceService {
  // Create a new device
  async createDevice(data: DevicePayload): Promise<Device> {
    try {
      const formData = new FormData();
      formData.append("hackathonId", data.hackathonId);
      formData.append("roundId", data.roundId);
      formData.append("roundLocationId", data.roundLocationId);
      formData.append("name", data.name);
      formData.append("description", data.description || "");
      formData.append("status", data.status);

      data.files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("/identity-service/api/v1/devices", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenService_v0.getAccessToken()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to create device: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating device:", error);
      throw error;
    }
  }

  // Get all devices
  async getAllDevices(): Promise<Device[]> {
    try {
      const response = await fetch("/identity-service/api/v1/devices", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenService_v0.getAccessToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch devices: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching devices:", error);
      throw error;
    }
  }

  // Get a device by ID
  async getDevice(id: string): Promise<Device> {
    try {
      const response = await fetch(`/identity-service/api/v1/devices/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenService_v0.getAccessToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch device: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching device:", error);
      throw error;
    }
  }

  // Get devices by round ID
  async getDevicesByRoundId(roundId: string): Promise<Device[]> {
    try {
      const response = await fetch(`/identity-service/api/v1/devices/round/${roundId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenService_v0.getAccessToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch devices by roundId: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching devices by roundId:", error);
      throw error;
    }
  }

  // Get devices by round location ID
  async getDevicesByRoundLocationId(roundLocationId: string): Promise<Device[]> {
    try {
      const response = await fetch(`/identity-service/api/v1/devices/round-location/${roundLocationId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenService_v0.getAccessToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch devices by roundLocationId: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching devices by roundLocationId:", error);
      throw error;
    }
  }

  async updateDevice(id: string, data: DevicePayload): Promise<Device> {
    try {
      const formData = new FormData();
      formData.append("hackathonId", data.hackathonId);
      formData.append("roundId", data.roundId);
      formData.append("roundLocationId", data.roundLocationId);
      formData.append("name", data.name);
      formData.append("description", data.description || "");
      formData.append("status", data.status);

      data.files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch(`/identity-service/api/v1/devices/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${tokenService_v0.getAccessToken()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to update device: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating device:", error);
      throw error;
    }
  }

  // Delete a device
  async deleteDevice(id: string): Promise<void> {
    try {
      const response = await fetch(`/identity-service/api/v1/devices/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${tokenService_v0.getAccessToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete device: ${response.statusText}`);
      }
      console.log("Device deleted successfully");
    } catch (error) {
      console.error("Error deleting device:", error);
      throw error;
    }
  }
}

export const deviceService = new DeviceService();
