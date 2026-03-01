import cartApi from '@/api/cartApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useCart = () => {
  const queryClient = useQueryClient();

  const cartQuery = useQuery({
    queryKey: ['carts'],
    queryFn: cartApi.getMyCart,
  });

  const cartData = cartQuery.data?.items ?? [];

  const addToCartMutation = useMutation({
    mutationFn: (payload: { productId: number; quantity: number }) =>
      cartApi.addToCart(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carts'] });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: cartApi.removeItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carts'] });
    },
  });

  const cartTotal = cartData.reduce(
    (sum: number, item: any) => sum + (item.price * item.quantity),
    0
  );

  return {
    cart: cartData,
    isLoading: cartQuery.isLoading,
    isError: cartQuery.isError,
    removeItem: removeItemMutation.mutate,
    isRemoving: removeItemMutation.isPending,
    addToCart: addToCartMutation.mutate,
    isAdding: addToCartMutation.isPending,
    cartTotal
  };
};