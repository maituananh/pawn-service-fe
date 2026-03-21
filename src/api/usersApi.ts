import { UserProfile } from "@/type/user.type";
import axiosClient from "./axiosClient";

const usersApi = {
  async getAll(): Promise<UserProfile[]> {
    const { data } = await axiosClient.get<UserProfile[]>("/users");
    return data ?? [];
  },

  async getById(id: number): Promise<UserProfile> {
    const { data } = await axiosClient.get<UserProfile>(`/users/${id}`);
    if (!data) throw new Error("User not found");
    return data;
  },

  async uploadAvatar(file: File): Promise<any> {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await axiosClient.post<any>("/users/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  update: async (id: number, payload: any) => {
    const { data } = await axiosClient.put(`/users/${id}`, payload);
    return data;
  },
};

export default usersApi;
