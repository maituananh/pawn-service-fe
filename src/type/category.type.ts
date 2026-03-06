export interface Category {
  id: number;
  name: string;
  description?: string;
  note?: string;
  status: boolean;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface CategoryCreateRequest {
  name: string;
  note: string;
  startDay: string;
  endDate: string;
  isActive?: boolean;
}
