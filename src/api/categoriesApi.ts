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
};

export default categoriesApi;
