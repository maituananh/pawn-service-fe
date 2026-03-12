import orderApi from '@/api/orderApi';
import { CheckoutRequest } from '@/type/order.type';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useOrder = () => {
  const checkoutMutation = useMutation({
    mutationFn: (data: CheckoutRequest) => orderApi.checkout(data),
  });

  const useGetOrders = () => {
    return useQuery({
      queryKey: ['orders'],
      queryFn: () => orderApi.getOrders(),
    });
  };

  const useGetOrderDetail = (orderId: number) => {
    return useQuery({
      queryKey: ['orders', orderId],
      queryFn: () => orderApi.getOrderDetail(orderId),
      enabled: !!orderId,
    });
  };

  const useGetOrderStatus = (orderId: number) => {
    return useQuery({
      queryKey: ['orders', 'status', orderId],
      queryFn: () => orderApi.getOrderStatus(orderId),
      enabled: !!orderId,
      refetchInterval: (query) => {
        // Stop polling if status is final (PAID, CANCELLED, etc. - logic depends on backend)
        const status = query.state.data?.status;
        if (status && ['PAID', 'CANCELLED', 'FAILED', 'COMPLETED'].includes(status)) {
          return false;
        }
        return 3000; // Poll every 3 seconds
      },
    });
  };

  return {
    checkout: checkoutMutation.mutate,
    isCheckingOut: checkoutMutation.isPending,
    useGetOrders,
    useGetOrderDetail,
    useGetOrderStatus,
  };
};
