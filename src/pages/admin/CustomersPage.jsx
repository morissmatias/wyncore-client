import { useState } from 'react'
import { useFetch } from '../../hooks/useFetch'
import { getAllCustomers, getCustomer } from '../../api/customers.api'
import { formatDateTime } from '../../utils/format'
import Modal from '../../components/ui/Modal'
import PageLoader from '../../components/ui/PageLoader'
import EmptyState from '../../components/ui/EmptyState'
import { FiUsers, FiEye } from 'react-icons/fi'

export default function CustomersPage() {
  const { data: customers, loading } = useFetch(getAllCustomers)
  const [selected, setSelected] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const viewCustomer = async (id) => {
    try {
      setDetailLoading(true)
      const res = await getCustomer(id)
      setSelected(res.data.data)
    } catch {/* ignore */} finally { setDetailLoading(false) }
  }

  if (loading) return <PageLoader />

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-brand-blue mb-6">Customers</h1>

      {!customers?.length
        ? <EmptyState icon={<FiUsers />} title="No customers yet" />
        : <div className="card overflow-hidden p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {['Name','Email','Phone','Company','Orders','Joined',''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {customers.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-brand-blue">{c.name}</td>
                    <td className="px-4 py-3 text-gray-500">{c.email}</td>
                    <td className="px-4 py-3 text-gray-500">{c.phone}</td>
                    <td className="px-4 py-3 text-gray-500">{c.companyOrigin}</td>
                    <td className="px-4 py-3 text-center font-semibold">{c._count?.orders ?? 0}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{formatDateTime(c.createdAt)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => viewCustomer(c.id)} className="text-brand-blue hover:text-brand-blueLight">
                        <FiEye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      }

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Customer Details">
        {detailLoading ? <div className="py-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-brand-green" /></div>
        : selected && (
          <div className="space-y-3 text-sm">
            {[['Name',selected.name],['Email',selected.email],['Phone',selected.phone],['Company',selected.companyOrigin],['Member since',formatDateTime(selected.createdAt)]].map(([l,v]) => (
              <div key={l} className="flex justify-between"><span className="text-gray-400">{l}</span><span className="font-medium">{v}</span></div>
            ))}
            <div className="border-t pt-3">
              <p className="font-medium mb-2">Orders ({selected.orders?.length})</p>
              {selected.orders?.slice(0,5).map(o => (
                <div key={o.id} className="flex justify-between text-xs py-1 border-b border-gray-50">
                  <span>{o.orderType}</span>
                  <span className="text-gray-400">{formatDateTime(o.createdAt)}</span>
                  <span className={`badge-${o.status.toLowerCase()}`}>{o.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
