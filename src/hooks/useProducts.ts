import productsApi from '@/api/productApi';
import { Product } from '@/type/product.type';
import { useQuery } from '@tanstack/react-query';

const PRODUCTS_QUERY_KEY = ['products'];

export const useProducts = () => {
  const { data, isFetching, isError, error, refetch } = useQuery<Product[]>({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: productsApi.getAll,
    retry: 1,
  });

  return {
    products: data ?? [],
    isLoading: isFetching,
    isError,
    error,
    refetch,
  };
};
