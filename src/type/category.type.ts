export interface Category {
  id: number;
  name: string;
  note: string;
  isActive: boolean;
  createdAt: string;
  updateAt: string;
}

export interface CategoryCreateRequest {
  id?: number;
  name: string;
  note: string;
  startDay: string;
  endDate: string;
}