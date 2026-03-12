export enum PaymentMethod {
  STRIPE = 'STRIPE',
  COD = 'COD',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
  // Keep older ones for backward compatibility if needed by other components temporarily
  PAID = 'PAID',
  COMPLETED = 'COMPLETED',
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
  orderId?: number;
  orderCode: string;
  totalAmount: number;
  status: OrderStatus;
  orderStatus?: OrderStatus;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  note?: string;
  paymentMethod: PaymentMethod;
  createdAt: string;
  items: OrderItemResponse[];
}

export interface PaginatedOrderResponse {
  data: OrderDetailResponse[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
}

export interface OrderParams {
  page?: number;
  size?: number;
  status?: OrderStatus;
  orderStatus?: OrderStatus; // Backup param name
}
