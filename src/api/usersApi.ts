import { Product, ProductCreateRequest } from '@/type/product.type';
import axiosClient from './axiosClient';
import { UserProfile } from '@/type/user.type';

const usersApi = {
  async getAll(): Promise<UserProfile[]> {
    const { data } = await axiosClient.get<UserProfile[]>('/users');
    return data ?? [];
  },

  async getById(id: number): Promise<UserProfile> {
    const { data } = await axiosClient.get<UserProfile>(`/users/${id}`);
    if (!data) throw new Error('User not found');
    return data;
  },

  async create(payload: ProductCreateRequest) {
    const { data } = await axiosClient.post('/products', payload);
    return data;
  },

  async update(id: number, payload: Partial<ProductCreateRequest>) {
    const { data } = await axiosClient.put(`/products/${id}`, payload);
    return data;
  },

  async delete(id: number): Promise<void> {
    await axiosClient.delete(`/products/${id}`);
  },
};

export default usersApi;
