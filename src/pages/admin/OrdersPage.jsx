import { useState } from 'react'
import { useFetch } from '../../hooks/useFetch'
import { getAllOrders } from '../../api/orders.api'
import { formatCurrency, formatDateTime } from '../../utils/format'
import StatusBadge from '../../components/ui/StatusBadge'
import PageLoader from '../../components/ui/PageLoader'
import EmptyState from '../../components/ui/EmptyState'
import { FiShoppingBag } from 'react-icons/fi'

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter]     = useState('')
  const { data: orders, loading } = useFetch(
    () => getAllOrders({ status: statusFilter || undefined, type: typeFilter || undefined }),
    [statusFilter, typeFilter]
  )

  if (loading) return <PageLoader />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-brand-blue">Orders</h1>
        <div className="flex gap-2">
          <select className="input w-auto text-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            {['PENDING','APPROVED','REJECTED','CANCELLED','DELIVERED'].map(s => <option key={s}>{s}</option>)}
          </select>
          <select className="input w-auto text-sm" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="">All Types</option>
            <option value="PRODUCT">Product</option>
            <option value="SERVICE">Service</option>
          </select>
        </div>
      </div>

      {!orders?.length
        ? <EmptyState icon={<FiShoppingBag />} title="No orders found" />
        : <div className="card overflow-hidden p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {['Customer','Type','Status','Amount','Date','Invoice'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-brand-blue">{o.customer.name}</p>
                      <p className="text-xs text-gray-400">{o.customer.companyOrigin}</p>
                    </td>
                    <td className="px-4 py-3"><span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{o.orderType}</span></td>
                    <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                    <td className="px-4 py-3 font-medium">{o.invoice ? formatCurrency(o.invoice.totalAmount) : '—'}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{formatDateTime(o.createdAt)}</td>
                    <td className="px-4 py-3 text-xs font-mono text-gray-500">{o.invoice?.invoiceNumber || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      }
    </div>
  )
}
