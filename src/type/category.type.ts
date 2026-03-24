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
    isActive?: boolean;
}
