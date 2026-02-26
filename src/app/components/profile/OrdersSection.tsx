"use client";

import { optionForFilter } from "@/app/constants/constData";
import { useOrderHandlers } from "@/app/hook/useOrderHandlers";
// import { usePaymentGuide } from "@/app/hook/usePaymentGuide";
import { useGetAllOrdersQuery } from "@/app/redux/services/orderApis";
import { Order } from "@/app/types/order";
import { Empty, Pagination, Radio, Spin } from "antd";
import "driver.js/dist/driver.css";
import { memo } from "react";
import DeliveryInformation from "./order-components/DeliveryInformation";
import DottedLineSeparator from "./order-components/DottedLineSeparator";
import HeaderSectionWithGradient from "./order-components/HeaderSectionWithGradient";
import ItemDetailSection from "./order-components/ItemDetailSection";
import StatusAndAmountSection from "./order-components/StatusAndAmountSection";
import SwitchSection from "./order-components/SwitchSection";


function OrdersSection() {
  const {
    currentPage,
    status,
    processingOrderId,
    handleToggleChange,
    handlePayment,
    handleStatusChange,
    handlePageChange,
    getToggleState,
    isPaymentEnabled,
    createPaymentLoading,
    queryParams
  } = useOrderHandlers({ orders: [] });

  const { data: orderResponse, isLoading, error } = useGetAllOrdersQuery(queryParams);

  const orders: Order[] = orderResponse?.data || [];
  const pagination = orderResponse?.pagination;

  // usePaymentGuide(orders.length);
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spin size="large" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Failed to load orders</p>
      </div>
    );
  }
  return (
    <div className="space-y-6 p-2 sm:p-4">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">My Orders</h2>

      <Radio.Group
        value={status}
        onChange={(e) => handleStatusChange(e.target.value)}
        options={optionForFilter}
      />

      <div className="grid m-6 sm:grid-cols-2 grid-cols-1 xl:grid-cols-3 gap-3">
        {orders?.length === 0 ? (
          <div className="py-10 col-span-5">
            <Empty description="No orders found" />
          </div>
        ) : (
          orders?.map((order) => {
            const showDetails = getToggleState(order?._id);
            const isProcessing = processingOrderId === order?._id;
            const canPay = isPaymentEnabled(order?.delivery_status, order?.payment_status);

            return (
              <div
                key={order?._id}
                className="order-item-card bg-white overflow-hidden border border-gray-200 shadow transition-shadow duration-300"
              >
                {/* Header Section with gradient */}
                <HeaderSectionWithGradient order={order} />
                {/* Main Content */}
                <div className="p-2">
                  {/* Status and Amount Section */}
                  <StatusAndAmountSection canPay={canPay} createPaymentLoading={createPaymentLoading} handlePayment={handlePayment} isProcessing={isProcessing} order={order} />
                  {/* Dotted Line Separator */}
                  <DottedLineSeparator />
                  {/* Switch Section */}
                  <SwitchSection order={order} showDetails={showDetails} handleToggleChange={handleToggleChange} />
                  {/* Items Section */}
                  {showDetails && (
                    <ItemDetailSection order={order} />
                  )}
                  {/* Delivery Information */}
                  {!showDetails && (
                    <DeliveryInformation order={order} />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {pagination?.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination
            current={currentPage}
            total={pagination.totalItems}
            pageSize={pagination.itemsPerPage}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
}

export default memo(OrdersSection);