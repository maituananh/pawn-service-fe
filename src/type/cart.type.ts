export interface CartItem {
  productId: number;
  oldPrice: any;
  images: any;
  category: string;
  image: string;
  id: number;
  name: string;
  price: number;
  description?: any;
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