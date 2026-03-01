import { PaymentRequest } from "@/type/payment.type";
import axiosClient from "./axiosClient";

const paymentApi = {
  createPayment: (data: PaymentRequest) => {
    const url = "/payment";
    return axiosClient.post(url, data);
  },
};

export default paymentApi;