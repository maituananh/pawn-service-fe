import { UserProfile } from "@/type/user.type";
import axiosClient from "./axiosClient";

const usersApi = {
    async getAll(): Promise<UserProfile[]> {
        const { data } = await axiosClient.get<any[]>("/users");

        return (data ?? []).map((u) => ({
            ...u,
            cardId: u.cardId || u.card_id || ""
        }));
    },

    async getById(id: number): Promise<UserProfile> {
        const { data } = await axiosClient.get<any>(`/users/${id}`);
        if (!data) throw new Error("User not found");

        return {
            ...data,
            cardId: data.cardId || data.card_id || ""
        };
    },

    async uploadAvatar(file: File): Promise<any> {
        const formData = new FormData();
        formData.append("file", file);

        const { data } = await axiosClient.post<any>("/users/avatar", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });

        return data;
    },

    update: async (id: number, payload: any) => {
        const newPayload = {
            ...payload,
            card_id: payload.cardId || ""
        };

        delete newPayload.cardId;

        return axiosClient.put(`/users/${id}`, newPayload);
    }
};

export default usersApi;
