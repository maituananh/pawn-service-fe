export interface CartItem {
    cartItemId: number;
    productId: number;
    oldPrice: number | null;
    images: string[];
    category: string;
    image: string;
    id: number;
    name: string;
    price: number;
    description?: string;
    quantity: number;
    startDate: string;
    endDate: string;
    type: string;
    productName?: string;
    status?: string;
    isActived?: boolean;
}

export interface AddToCartRequest {
    productId: number;
    quantity: number;
}

export interface UpdateCartRequest {
    productId: number;
    quantity: number;
}
