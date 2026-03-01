import paymentApi from "@/api/paymentApi";
import { PaymentRequest } from "@/type/payment.type";
import { useMutation } from "@tanstack/react-query";

export const usePayment = () => {
  const mutation = useMutation({
    mutationFn: (data: PaymentRequest) => paymentApi.createPayment(data),
  });

  return {
    processPayment: mutation.mutate,
    isProcessing: mutation.isPending,
  };
};