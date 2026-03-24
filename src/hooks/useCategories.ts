import categoriesApi from "@/api/categoriesApi";
import { Category } from "@/type/category.type";
import { useQuery } from "@tanstack/react-query";

const CATEGORIES_QUERY_KEY = ["categories"];

export const useCategories = () => {
    const { data, isLoading, isFetching, isError, error, refetch } = useQuery<Category[]>({
        queryKey: CATEGORIES_QUERY_KEY,
        queryFn: async () => {
            const res = await categoriesApi.getAll();
            return res ?? [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5
    });

    return {
        categories: data ?? [],
        isLoading,
        isFetching,
        isError,
        error,
        refetch
    };
};
