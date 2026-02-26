
import { Order } from '@/app/types/order'
import { getPaymentStatusColor, getStatusColor } from '@/app/utils/orderStatusUtils'
import { Button, Tag } from 'antd'
import { memo } from 'react'
import { MdOutlinePayment } from 'react-icons/md'

interface StatusAndAmountSectionProps {
  order: Order,
  isProcessing: boolean,
  canPay: boolean,
  createPaymentLoading: boolean,
  handlePayment: any,
}

function StatusAndAmountSection({ order, isProcessing, canPay, createPaymentLoading, handlePayment }: StatusAndAmountSectionProps) {
  return (
    <div className="grid grid-cols-1 gap-4 mb-6">
      <div className="bg-gray-50 border rounded p-3 sm:p-4">
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Total Amount</p>
          <p className="text-sm font-bold text-gray-800">
            ${order?.total_amount?.toFixed(2) || '0.00'}
          </p>
        </div>
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Payment Status</p>
          <Tag
            className="payment-status-tag"
            color={getPaymentStatusColor(order?.payment_status)}
          >
            {order?.payment_status || 'N/A'}
          </Tag>
        </div>
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Delivery Status</p>
          <Tag
            className="delivery-status-tag"
            color={getStatusColor(order?.delivery_status)}
          >
            {order?.delivery_status || 'N/A'}
          </Tag>
        </div>
        {order?.payment_status !== 'paid' && <Button
          className="pay-now-btn mt-4"
          loading={isProcessing}
          disabled={!canPay || isProcessing || createPaymentLoading}
          onPointerDown={() => handlePayment(order?._id)}
          icon={<MdOutlinePayment />}
          style={{ width: '100%' }}
        >
          {isProcessing ? 'Processing...' : 'Pay Now'}
        </Button>}

        {!canPay && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            {order?.payment_status.toLowerCase() === 'paid'
              ? 'Payment already completed'
              : 'Available for pending delivery only'}
          </p>
        )}
      </div>
    </div>
  )
}

export default memo(StatusAndAmountSection)