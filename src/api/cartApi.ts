import { CartItem } from "@/type/cart.type";
import axiosClient from "./axiosClient";

const cartApi = {
    async getMyCart(): Promise<CartItem[]> {
        const { data } = await axiosClient.get("/carts");
        return data;
    },

    async addToCart(payload: { productId: number; quantity: number }) {
        const { data } = await axiosClient.post("/carts", payload);
        return data;
    },

    async removeItem(productIds: number[]): Promise<void> {
        await axiosClient.delete("/carts", { data: productIds });
    }
};

export default cartApi;
