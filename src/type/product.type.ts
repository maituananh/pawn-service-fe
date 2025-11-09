export interface Product {
  oldPrice: any;
  images: any;
  category: string;
  image: string;
  id: number;
  name: string;
  price: number;
  description?: any;
}

export interface ProductCreateRequest {
  id?: number;
  name: string;
  price: number;
  startDay: string;
  endDate: string;
  type: string;
  imageIds: number[];
}