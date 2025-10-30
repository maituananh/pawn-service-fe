import { Product } from '@/type/product.type';
import axiosClient from './axiosClient';

const productsApi = {
  async getAll(): Promise<Product[]> {
    const { data } = await axiosClient.get<Product[]>('/products');
    return data ?? [];
  },

  async getById(id: number): Promise<Product> {
    const { data } = await axiosClient.get<Product>(`/products/${id}`);
    if (!data) throw new Error('Product not found');
    return data;
  },
};

export default productsApi;
