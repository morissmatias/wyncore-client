import { useFetch } from '../../hooks/useFetch'
import { getMyOrders, cancelOrder } from '../../api/orders.api'
import { formatCurrency, formatDateTime } from '../../utils/format'
import StatusBadge from '../../components/ui/StatusBadge'
import PageLoader from '../../components/ui/PageLoader'
import EmptyState from '../../components/ui/EmptyState'
import toast from 'react-hot-toast'
import { FiPackage } from 'react-icons/fi'

export default function MyOrdersPage() {
  const { data: orders, loading, refetch } = useFetch(getMyOrders)

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
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-brand-blue">{order.orderType} Order</p>
                    <p className="text-xs text-gray-400">{formatDateTime(order.createdAt)}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                {order.invoice && (
                  <p className="text-sm text-gray-600 mb-2">Invoice: <span className="font-medium">{order.invoice.invoiceNumber}</span> — {formatCurrency(order.invoice.totalAmount)}</p>
                )}
                <p className="text-sm text-gray-500 mb-3">Delivery: {order.deliveryAddress}</p>
                {order.status === 'PENDING' && (
                  <button onClick={() => handleCancel(order.id)} className="text-sm text-red-500 hover:text-red-700">Cancel Order</button>
                )}
              </div>
            ))}
          </div>
      }
    </div>
  )
}
