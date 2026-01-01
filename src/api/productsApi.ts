import { Page } from "@/type/page.type";
import { Product, ProductCreateRequest } from "@/type/product.type";
import axiosClient from "./axiosClient";

const productsApi = {
  async getAll(): Promise<Product[]> {
    const { data } = await axiosClient.get<Product[]>("/products");
    return data ?? [];
  },

  async getById(id: number): Promise<Product> {
    const { data } = await axiosClient.get<Product>(`/products/${id}`);
    if (!data) throw new Error("Product not found");
    return data;
  },

  async create(payload: ProductCreateRequest) {
    const { data } = await axiosClient.post("/products", payload);
    return data;
  },

  async update(id: number, payload: Partial<ProductCreateRequest>) {
    const { data } = await axiosClient.put(`/products/${id}`, payload);
    return data;
  },

  async delete(id: number): Promise<void> {
    await axiosClient.delete(`/products/${id}`);
  },

  async search(query: {
    page: number;
    size: number;
    name?: string;
    categoryIds?: number[];
  }): Promise<Page<Product>> {
    const { data } = await axiosClient.get<Page<Product>>("/products/search", {
      params: query,
    });

    return data;
  },
};

export default productsApi;
