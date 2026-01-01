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
};

export default usersApi;
