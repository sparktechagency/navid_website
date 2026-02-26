import { useCreatePaymentMutation } from "@/app/redux/services/paymentApis";
import { Order } from "@/app/types/order";
import React, { useCallback, useState } from "react";
import toast from "react-hot-toast";

interface UseOrderHandlersProps {
  orders: Order[];
}

export const useOrderHandlers = ({ orders }: UseOrderHandlersProps) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [status, setStatus] = useState<string | null>(null);
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(null);
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({});

  const [createPayment, { isLoading: createPaymentLoading }] = useCreatePaymentMutation();

  const handleToggleChange = useCallback((orderId: string, value: boolean) => {
    setToggleStates(prev => ({
      ...prev,
      [orderId]: value
    }));
  }, []);

  const getToggleState = useCallback((orderId: string) => {
    return toggleStates[orderId] !== undefined ? toggleStates[orderId] : true;
  }, [toggleStates]);

  const isPaymentEnabled = useCallback((deliveryStatus: string, paymentStatus: string) => {
    const delivery = deliveryStatus.toLowerCase();
    const payment = paymentStatus.toLowerCase();
    // Only enable if delivery is pending AND payment is not paid
    return delivery === 'pending' && payment !== 'paid';
  }, []);

  const handlePayment = useCallback(async (id: string) => {
    setProcessingOrderId(id);
    try {
      if (!id) {
        throw new Error("Order is not found!");
      }
      const data = {
        order_id: id
      };
      const res = await createPayment(data).unwrap();
      if (!res?.success) {
        throw new Error(res?.message || "Something went wrong while processing payment!");
      }
      toast.success(res?.message || 'Your payment link has been created.');
      if (typeof window !== 'undefined') {
        window.open(res?.url, '_blank');
      }
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || "Something went wrong while processing payment!");
    } finally {
      setProcessingOrderId(null);
    }
  }, [createPayment]);

  const handleStatusChange = useCallback((value: string | null) => {
    setStatus(value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return {
    // State
    currentPage,
    status,
    processingOrderId,
    toggleStates,

    // Actions
    setCurrentPage,
    setStatus,
    setProcessingOrderId,

    // Handlers
    handleToggleChange,
    handlePayment,
    handleStatusChange,
    handlePageChange,

    // Getters
    getToggleState,
    isPaymentEnabled,

    // Derived states
    createPaymentLoading,

    // Query params
    queryParams: {
      page: currentPage,
      limit: 6,
      sort: 'createdAt',
      order: 'desc',
      ...(status !== null ? { delivery_status: status } : {})
    }
  };
};