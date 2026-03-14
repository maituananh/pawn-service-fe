import orderApi from "@/api/orderApi";
import { CheckoutRequest, OrderParams } from "@/type/order.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useOrder = () => {
  const queryClient = useQueryClient();

  const checkoutMutation = useMutation({
    mutationFn: (data: CheckoutRequest) => orderApi.checkout(data),
  });

  const cancelOrderMutation = useMutation({
    mutationFn: (orderId: number) => orderApi.cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const useGetOrders = (params?: OrderParams) => {
    return useQuery({
      queryKey: ["orders", params],
      queryFn: () => orderApi.getOrders(params),
    });
  };

  const useGetOrdersAdmin = (params?: OrderParams) => {
    return useQuery({
      queryKey: ["admin.orders", params],
      queryFn: () => orderApi.getOrdersAdmin(params),
    });
  };

  const useGetOrderDetail = (orderId: number) => {
    return useQuery({
      queryKey: ["orders", orderId],
      queryFn: () => orderApi.getOrderDetail(orderId),
      enabled: !!orderId,
    });
  };

  const useGetOrderStatus = (orderId: number) => {
    return useQuery({
      queryKey: ["orders", "status", orderId],
      queryFn: () => orderApi.getOrderStatus(orderId),
      enabled: !!orderId,
      refetchInterval: (query) => {
        const status = (query.state.data as any)?.status;
        if (
          status &&
          ["PAID", "CANCELLED", "FAILED", "COMPLETED"].includes(status)
        ) {
          return false;
        }
        return 3000;
      },
    });
  };

  return {
    checkout: checkoutMutation.mutate,
    isCheckingOut: checkoutMutation.isPending,
    cancelOrder: cancelOrderMutation.mutate,
    isCancelling: cancelOrderMutation.isPending,
    useGetOrders,
    useGetOrderDetail,
    useGetOrderStatus,
    useGetOrdersAdmin,
  };
};
