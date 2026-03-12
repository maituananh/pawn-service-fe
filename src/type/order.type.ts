export enum PaymentMethod {
  STRIPE = 'STRIPE',
  COD = 'COD',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
  SHIPPING = 'SHIPPING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface CheckoutRequest {
  cartItemIds: number[];
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  note?: string;
  paymentMethod: PaymentMethod;
}

export interface CheckoutResponse {
  orderId: number;
  paymentUrl?: string;
  totalAmount: number;
  status: OrderStatus;
  message?: string;
}

export interface OrderStatusResponse {
  orderId: number;
  status: OrderStatus;
}

export interface OrderItemResponse {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

export interface OrderDetailResponse {
  id: number;
  orderCode: string;
  totalAmount: number;
  status: OrderStatus;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  note?: string;
  paymentMethod: PaymentMethod;
  createdAt: string;
  items: OrderItemResponse[];
}
