import { useState } from 'react'
import { useFetch } from '../../hooks/useFetch'
import { getMyOrders, cancelOrder } from '../../api/orders.api'
import { formatCurrency, formatDateTime } from '../../utils/format'
import StatusBadge from '../../components/ui/StatusBadge'
import PageLoader from '../../components/ui/PageLoader'
import EmptyState from '../../components/ui/EmptyState'
import toast from 'react-hot-toast'
import { FiPackage, FiChevronDown, FiChevronUp } from 'react-icons/fi'

export default function MyOrdersPage() {
  const { data: orders, loading, refetch } = useFetch(getMyOrders)
  const [expandedId, setExpandedId] = useState(null)

  const toggleExpand = (id) => setExpandedId(prev => prev === id ? null : id)

  const handleCancel = async (id) => {
    if (!confirm('Cancel this order?')) return
    try {
      await cancelOrder(id)
      toast.success('Order cancelled.')
      refetch()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to cancel.') }
  }

  if (loading) return <PageLoader />

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="font-display text-2xl font-bold text-brand-blue mb-6">My Orders</h1>
      {!orders?.length
        ? <EmptyState icon={<FiPackage />} title="No orders yet" description="Place your first order from our catalog." />
        : <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="card">
                {/* Header - always visible */}
                <div
                  className="flex items-start justify-between cursor-pointer"
                  onClick={() => toggleExpand(order.id)}
                >
                  <div>
                    <p className="font-semibold text-brand-blue">{order.orderType} Order</p>
                    <p className="text-xs text-gray-400">{formatDateTime(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={order.status} />
                    {expandedId === order.id
                      ? <FiChevronUp className="w-4 h-4 text-gray-400" />
                      : <FiChevronDown className="w-4 h-4 text-gray-400" />
                    }
                  </div>
                </div>

                {/* Invoice summary - always visible */}
                {order.invoice && (
                  <p className="text-sm text-gray-600 mt-2">
                    Invoice: <span className="font-medium">{order.invoice.invoiceNumber}</span> — {formatCurrency(order.invoice.totalAmount)}
                  </p>
                )}

                {/* Expanded details */}
                {expandedId === order.id && (
                  <div className="mt-4 border-t pt-4 space-y-3">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Delivery Address</p>
                      <p className="text-sm">{order.deliveryAddress}</p>
                    </div>

                    {/* Product items */}
                    {order.orderItems?.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-400 mb-2">Items Ordered</p>
                        <div className="space-y-2">
                          {order.orderItems.map(item => (
                            <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                              {item.product?.imageUrl
                                ? <img src={item.product.imageUrl} alt={item.product.name} className="w-10 h-10 rounded-lg object-cover" />
                                : <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400 text-xs">No img</div>
                              }
                              <div className="flex-1">
                                <p className="text-sm font-medium text-brand-blue">{item.product?.name}</p>
                                <p className="text-xs text-gray-500">{formatCurrency(item.unitPrice)} × {item.quantity}</p>
                              </div>
                              <p className="text-sm font-semibold text-brand-green">{formatCurrency(item.subtotal)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Service request */}
                    {order.serviceRequest && (
                      <div>
                        <p className="text-xs text-gray-400 mb-2">Service Requested</p>
                        <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-sm">
                          <p><span className="text-gray-400">Service:</span> <span className="font-medium">{order.serviceRequest.service?.name}</span></p>
                          <p><span className="text-gray-400">Details:</span> {order.serviceRequest.details}</p>
                          {order.serviceRequest.preferredDate && (
                            <p><span className="text-gray-400">Preferred Date:</span> {formatDateTime(order.serviceRequest.preferredDate)}</p>
                          )}
                          {order.serviceRequest.quotedPrice && (
                            <p><span className="text-gray-400">Quoted Price:</span> <span className="font-semibold text-brand-green">{formatCurrency(order.serviceRequest.quotedPrice)}</span></p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Invoice remarks */}
                    {order.invoice?.remarks && (
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Admin Remarks</p>
                        <p className="text-sm bg-yellow-50 border border-yellow-200 rounded-lg p-3">{order.invoice.remarks}</p>
                      </div>
                    )}

                    {order.status === 'PENDING' && (
                      <button onClick={() => handleCancel(order.id)} className="text-sm text-red-500 hover:text-red-700">Cancel Order</button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
      }
    </div>
  )
}