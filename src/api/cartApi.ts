import axiosClient from "./axiosClient";

const cartApi = {
  async getMyCart(): Promise<any> {
    const { data } = await axiosClient.get("/carts");
    return data;
  },

  async addToCart(payload: { productId: number; quantity: number }) {
    const { data } = await axiosClient.post("/carts", payload);
    return data;
  },

  async removeItem(productId: number): Promise<void> {
    await axiosClient.delete(`/carts/${productId}`);
  },
};

export default cartApi;