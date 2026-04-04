export interface Category {
    id: number;
    name: string;
}

export interface Product {
    id: number;
    code: string;

    name: string;
    price: number;

    image?: string;
    images?: {
        id: number;
        url: string;
    }[];

    description?: string;

    stockQty: number;
    availableQty?: number;

    startDate: string;
    endDate: string;

    status?: string;
    isActived?: boolean;

    dailyProfit?: number;

    category?: Category;
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

    imageIds: number[];
}
