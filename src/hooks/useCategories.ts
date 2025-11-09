import categoriesApi from '@/api/categoriesApi';
import { Category } from '@/type/category.type';
import { useQuery } from '@tanstack/react-query';

const CATEGORIES_QUERY_KEY = ['categories'];

export const useCategories = () => {
  const { data, isFetching, isError, error, refetch } = useQuery<Category[]>({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: categoriesApi.getAll,
    retry: 1,
  });

  return {
    categories: data ?? [],
    isLoading: isFetching,
    isError,
    error,
    refetch,
  };
};
