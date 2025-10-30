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
    return axiosInstance.get("/admin/reports", { withCredentials: true });
  },

  // Vendors
  getVendors: (page = 1, limit = 20) => {
    return axiosInstance.get(`/admin/vendors`, { params: { page, limit }, withCredentials: true });
  },

  approveVendor: (vendorId: string) => {
    return axiosInstance.patch(`/admin/vendors/${vendorId}/approve`, undefined, { withCredentials: true });
  },

  deleteVendor: (vendorId: string) => {
    return axiosInstance.delete(`/admin/vendors/${vendorId}`, { withCredentials: true });
  },

  suspendeVendor: (vendorId: string) => {
    return axiosInstance.patch(`/admin/vendors/${vendorId}/suspend`, undefined, { withCredentials: true });
  },

  // Users
  getUsers: (page = 1, limit = 20) => {
    return axiosInstance.get(`/admin/users`, { params: { page, limit }, withCredentials: true });
  },

  deleteUser: (userId: string) => {
    return axiosInstance.delete(`/admin/users/${userId}`, { withCredentials: true });
  },

  // Riders
  getRiders: (page = 1, limit = 20) => {
    return axiosInstance.get(`/admin/riders`, { params: { page, limit }, withCredentials: true });
  },

  approveRider: (riderId: string) => {
    return axiosInstance.patch(`/admin/riders/${riderId}/approve`, undefined, { withCredentials: true });
  },

  deleteRider: (riderId: string) => {
    return axiosInstance.delete(`/admin/riders/${riderId}`, { withCredentials: true });
  },

  suspendRider: (riderId: string) => {
    return axiosInstance.patch(`/admin/riders/${riderId}/suspend`, undefined, { withCredentials: true });
  },
};
