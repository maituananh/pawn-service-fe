import productsApi from "@/api/productsApi";
import { Page } from "@/type/page.type";
import { Product } from "@/type/product.type";
import { useQuery } from "@tanstack/react-query";

const PRODUCTS_QUERY_KEY = ["products"];

export const useProducts = (query?: {
  page?: number;
  size?: number;
  name?: string;
  categoryIds?: number[];
}) => {
  const { data, isFetching, isError, error, refetch } = useQuery<Page<Product>>(
    {
      queryKey: [PRODUCTS_QUERY_KEY, query],
      queryFn: () =>
        productsApi.search({
          page: query?.page ?? 1,
          size: query?.size ?? 15,
          name: query?.name,
          categoryIds: query?.categoryIds,
        }),
      retry: 1,
    }
  );

  return {
    productsPage: data,
    isLoading: isFetching,
    isError,
    error,
    refetch,
  };
};
