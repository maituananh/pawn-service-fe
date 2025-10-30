import productsApi from '@/api/productApi';
import { Product } from '@/type/product.type';
import { useQuery } from '@tanstack/react-query';

export const useProduct = (id: number) => {
  return useQuery<Product>({
    queryKey: ['product', id],
    queryFn: () => productsApi.getById(id),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};
