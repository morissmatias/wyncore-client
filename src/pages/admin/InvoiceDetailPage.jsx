import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useFetch } from '../../hooks/useFetch'
import { getInvoice, reviewInvoice } from '../../api/invoices.api'
import { formatCurrency, formatDateTime } from '../../utils/format'
import StatusBadge from '../../components/ui/StatusBadge'
import PageLoader from '../../components/ui/PageLoader'
import toast from 'react-hot-toast'

export default function InvoiceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: invoice, loading, refetch } = useFetch(() => getInvoice(id), [id])
  const [remarks, setRemarks]       = useState('')
  const [quotedPrice, setQuotedPrice] = useState('')
  const [submitting, setSubmitting]  = useState(false)

  const handleReview = async (status) => {
    try {
      setSubmitting(true)
      await reviewInvoice(id, {
        status,
        remarks,
        ...(quotedPrice && { quotedPrice: Number(quotedPrice) }),
      })
      toast.success(`Invoice ${status.toLowerCase()} successfully.`)
      refetch()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to review invoice.')
    } finally { setSubmitting(false) }
  }

  if (loading) return <PageLoader />
  if (!invoice) return <div className="text-center py-20 text-gray-400">Invoice not found.</div>

  const order    = invoice.order
  const customer = order.customer
  const isPending = invoice.status === 'PENDING'
  const isService = order.orderType === 'SERVICE'

  return (
    <div className="max-w-3xl">
      <button onClick={() => navigate('/admin/invoices')} className="text-sm text-brand-blue hover:underline mb-4 flex items-center gap-1">
        ← Back to Invoices
      </button>

      {/* Invoice Header */}
      <div className="card mb-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide">Invoice</p>
            <h1 className="font-display text-2xl font-bold text-brand-blue">{invoice.invoiceNumber}</h1>
            <p className="text-sm text-gray-500 mt-1">{formatDateTime(invoice.createdAt)}</p>
          </div>
          <StatusBadge status={invoice.status} />
        </div>
      </div>

      {/* Customer Info */}
      <div className="card mb-4">
        <h2 className="font-semibold text-brand-blue mb-3">Customer Information</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[['Name', customer.name],['Email', customer.email],['Phone', customer.phone],['Company', customer.companyOrigin]].map(([l,v]) => (
            <div key={l}><p className="text-xs text-gray-400">{l}</p><p className="font-medium">{v}</p></div>
          ))}
        </div>
      </div>

      {/* Order Details */}
      <div className="card mb-4">
        <h2 className="font-semibold text-brand-blue mb-3">Order Details</h2>
        <p className="text-xs text-gray-400 mb-1">Type</p>
        <p className="text-sm font-medium mb-3">{order.orderType} ORDER</p>
        <p className="text-xs text-gray-400 mb-1">Delivery Address</p>
        <p className="text-sm mb-3">{order.deliveryAddress}</p>

        {/* Product items */}
        {order.orderItems?.length > 0 && (
          <div className="border rounded-lg overflow-hidden mt-3">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>{['Product','Qty','Unit Price','Subtotal'].map(h => <th key={h} className="px-3 py-2 text-left text-xs text-gray-500">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y">
                {order.orderItems.map(item => (
                  <tr key={item.id}>
                    <td className="px-3 py-2">{item.product.name}</td>
                    <td className="px-3 py-2">{item.quantity}</td>
                    <td className="px-3 py-2">{formatCurrency(item.unitPrice)}</td>
                    <td className="px-3 py-2 font-medium">{formatCurrency(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Service request */}
        {order.serviceRequest && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm space-y-2">
            <p><span className="text-gray-400">Service:</span> <span className="font-medium">{order.serviceRequest.service?.name}</span></p>
            <p><span className="text-gray-400">Details:</span> {order.serviceRequest.details}</p>
            {order.serviceRequest.preferredDate && (
              <p><span className="text-gray-400">Preferred Date:</span> {formatDateTime(order.serviceRequest.preferredDate)}</p>
            )}
          </div>
        )}

        <div className="flex justify-end mt-4 pt-3 border-t">
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="text-2xl font-bold text-brand-green">{formatCurrency(invoice.totalAmount)}</p>
          </div>
        </div>
      </div>

      {/* Review Panel - only if PENDING */}
      {isPending && (
        <div className="card border-2 border-yellow-200">
          <h2 className="font-semibold text-brand-blue mb-4">Review Invoice</h2>
          {isService && (
            <div className="mb-4">
              <label className="label">Quoted Price (PHP) — for service orders</label>
              <input className="input" type="number" min="0" value={quotedPrice} onChange={e => setQuotedPrice(e.target.value)} placeholder="Enter quoted amount" />
            </div>
          )}
          <div className="mb-4">
            <label className="label">Remarks (optional)</label>
            <textarea className="input" rows={3} value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Add notes for this review..." />
          </div>
          <div className="flex gap-3">
            <button onClick={() => handleReview('APPROVED')} disabled={submitting} className="btn-primary flex-1">
              {submitting ? 'Processing...' : '✓ Approve'}
            </button>
            <button onClick={() => handleReview('REJECTED')} disabled={submitting} className="btn-danger flex-1">
              {submitting ? 'Processing...' : '✗ Reject'}
            </button>
          </div>
        </div>
      )}

      {/* Review result if already reviewed */}
      {!isPending && invoice.remarks && (
        <div className="card bg-gray-50">
          <p className="text-sm text-gray-400 mb-1">Review Remarks</p>
          <p className="text-sm">{invoice.remarks}</p>
          {invoice.reviewedBy && <p className="text-xs text-gray-400 mt-2">Reviewed by {invoice.reviewedBy.name} · {formatDateTime(invoice.reviewedAt)}</p>}
        </div>
      )}
    </div>
  )
}
