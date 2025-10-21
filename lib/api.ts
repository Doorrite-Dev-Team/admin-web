import axios from "axios";
import axiosInstance from "./axiosInstance";

export const api = {
  // Auth
  login: async (email: string, password: string) => {
    const { data } = await axios.post(
      "/api/auth/login",
      {
        email,
        password,
      },
      {
        withCredentials: true,
      },
    );
    return data;
  },

  // Reports
  getReports: () => {
    return axiosInstance.get("/admin/reports");
  },

  // Vendors
  getVendors: (page = 1, limit = 20) => {
    return axiosInstance.get(`/admin/vendors`, { params: { page, limit } });
  },

  approveVendor: (vendorId: string) => {
    return axiosInstance.patch(`/admin/vendors/${vendorId}/approve`);
  },

  deleteVendor: (vendorId: string) => {
    return axiosInstance.delete(`/admin/vendors/${vendorId}`);
  },

  suspendeVendor: (vendorId: string) => {
    return axiosInstance.patch(`/admin/vendors/${vendorId}/suspend`);
  },

  // Users
  getUsers: (page = 1, limit = 20) => {
    return axiosInstance.get(`/admin/users`, { params: { page, limit } });
  },

  deleteUser: (userId: string) => {
    return axiosInstance.delete(`/admin/users/${userId}`);
  },

  // Riders
  getRiders: (page = 1, limit = 20) => {
    return axiosInstance.get(`/admin/riders`, { params: { page, limit } });
  },

  approveRider: (riderId: string) => {
    return axiosInstance.patch(`/admin/riders/${riderId}/approve`);
  },

  deleteRider: (riderId: string) => {
    return axiosInstance.delete(`/admin/riders/${riderId}`);
  },

  suspendRider: (riderId: string) => {
    return axiosInstance.patch(`/admin/riders/${riderId}/suspend`);
  },
};
