import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFetch } from '../../hooks/useFetch'
import { getAllInvoices } from '../../api/invoices.api'
import { formatCurrency, formatDateTime } from '../../utils/format'
import StatusBadge from '../../components/ui/StatusBadge'
import PageLoader from '../../components/ui/PageLoader'
import EmptyState from '../../components/ui/EmptyState'
import { FiFileText } from 'react-icons/fi'

export default function InvoicesPage() {
  const [statusFilter, setStatusFilter] = useState('')
  const navigate = useNavigate()
  const { data: invoices, loading } = useFetch(
    () => getAllInvoices({ status: statusFilter || undefined }),
    [statusFilter]
  )

  if (loading) return <PageLoader />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-brand-blue">Invoices</h1>
        <select className="input w-auto text-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          {['PENDING','APPROVED','REJECTED'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {!invoices?.length
        ? <EmptyState icon={<FiFileText />} title="No invoices found" />
        : <div className="card overflow-hidden p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {['Invoice #','Customer','Amount','Status','Date','Action'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {invoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-brand-blue">{inv.invoiceNumber}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{inv.order.customer.name}</p>
                      <p className="text-xs text-gray-400">{inv.order.customer.companyOrigin}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-brand-green">{formatCurrency(inv.totalAmount)}</td>
                    <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                    <td className="px-4 py-3 text-xs text-gray-500">{formatDateTime(inv.createdAt)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => navigate(`/admin/invoices/${inv.id}`)} className="text-xs text-brand-blue hover:underline font-medium">
                        {inv.status === 'PENDING' ? 'Review' : 'View'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      }
    </div>
  )
}
