export interface Product {
  code: string;
  dailyProfit: any;
  user?: any;
  oldPrice: any;
  images: any;
  category: string | any;
  image: string;
  id: number;
  name: string;
  price: number;
  description?: any;
  stockQty: number;
  availableQty?: number;
  startDate: string;
  endDate: string;
  type: string;
  isActived?: boolean;
  status?: string;
}

export interface ProductCreateRequest {
  name: string;
  price: number;
  startDate: string;
  endDate: string;
  categoryId: number;
  code: string;
  customerId: number;
  dailyProfit: number;
  stockQty: number;
  description: string;
  type: string;
  imageIds: number[];
}
