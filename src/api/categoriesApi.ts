import { Category, CategoryCreateRequest } from "@/type/category.type";
import axiosClient from "./axiosClient";

const categoriesApi = {
  async getAll(): Promise<Category[]> {
    const { data } = await axiosClient.get<Category[]>("/categories");
    return data ?? [];
  },

  async create(payload: CategoryCreateRequest) {
    const { data } = await axiosClient.post("/categories", payload);
    return data;
  },

  async getById(id: number): Promise<Category> {
    const { data } = await axiosClient.get<Category>(`/categories/${id}`);
    return data;
  },

  async update(id: number, payload: CategoryCreateRequest) {
    const { data } = await axiosClient.put(`/categories/${id}`, payload);
    return data;
  },

  async delete(id: number) {
    await axiosClient.delete(`/categories/${id}`);
  },
};

export default categoriesApi;
